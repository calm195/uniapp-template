import { config } from '@/config'
import type { ApiResponse } from '@/types/api'
import { storage } from './storage'

export class RequestError extends Error {
  constructor(
    message: string,
    public readonly code: number,
    public readonly cause?: unknown,
  ) {
    super(message)
    this.name = 'RequestError'
  }
}
type RequestOptions = Omit<UniApp.RequestOptions, 'success' | 'fail' | 'complete' | 'url'> & {
  url: string
  auth?: boolean
  silent?: boolean
}
type BeforeRequest = (options: RequestOptions) => RequestOptions
// 拦截器只使用存储层，避免 request、API 和 Pinia 互相循环依赖。
const requestInterceptors: BeforeRequest[] = [
  (options) => {
    const token = storage.get<string>('token')
    return {
      ...options,
      url: `${config.apiBaseUrl.replace(/\/$/, '')}/${options.url.replace(/^\//, '')}`,
      timeout: options.timeout ?? 15000,
      header: {
        'Content-Type': 'application/json',
        ...(options.auth !== false && token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.header,
      },
    }
  },
]
const responseInterceptors: Array<(response: ApiResponse<unknown>) => ApiResponse<unknown>> = []
export const interceptors = {
  request: {
    use(fn: BeforeRequest) {
      requestInterceptors.push(fn)
    },
  },
  response: {
    use(fn: (response: ApiResponse<unknown>) => ApiResponse<unknown>) {
      responseInterceptors.push(fn)
    },
  },
}

export async function request<T>(options: RequestOptions): Promise<T> {
  try {
    // 只允许相对接口路径，防止令牌被意外发送到第三方域名。
    if (/^(?:[a-z]+:)?\/\//i.test(options.url)) throw new RequestError('接口请使用相对路径', -1)
    const prepared = requestInterceptors.reduce((value, fn) => fn(value), options)
    return await new Promise<T>((resolve, reject) => {
      uni.request({
        ...prepared,
        success: (response) => {
          try {
            if (response.statusCode === 401) {
              uni.$emit('auth:expired')
              storage.remove('token')
              storage.remove('user')
              throw new RequestError('登录已过期，请重新登录', 401)
            }
            if (response.statusCode < 200 || response.statusCode >= 300) {
              throw new RequestError(`请求失败（${response.statusCode}）`, response.statusCode)
            }
            const body = response.data as ApiResponse<unknown>
            if (!body || typeof body !== 'object' || typeof body.code !== 'number') {
              throw new RequestError('接口返回格式错误', -2)
            }
            const result = responseInterceptors.reduce((value, fn) => fn(value), body)
            if (result.code !== 0)
              throw new RequestError(result.message || '业务处理失败', result.code)
            resolve(result.data as T)
          } catch (error) {
            reject(error)
          }
        },
        fail: (error) => reject(new RequestError('网络异常，请检查网络后重试', -1, error)),
      })
    })
  } catch (error) {
    const failure =
      error instanceof RequestError ? error : new RequestError('请求处理失败', -1, error)
    if (!options.silent) uni.showToast({ title: failure.message, icon: 'none' })
    throw failure
  }
}
