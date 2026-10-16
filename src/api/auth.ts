import { config } from '@/config'
import type { LoginInput, Session } from '@/types/api'
import { request } from '@/utils/request'

export async function login(input: LoginInput): Promise<Session> {
  if (config.useMock) {
    // 仅演示状态流转，无真实鉴权能力；正式环境必须关闭 mock。
    await new Promise((resolve) => setTimeout(resolve, 400))
    return {
      token: 'demo-token',
      user: { id: 'demo', nickname: '模板体验用户', phone: input.phone },
    }
  }
  return request<Session>({ url: '/auth/login', method: 'POST', data: input, auth: false })
}
