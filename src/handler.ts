import { getCSRFToken, getRoleName, getUserName } from './roblox'

interface RequestBody {
	groupId: number
	userId: number
	newRank: number
}

export async function handleRequest(request: Request): Promise<Response> {
	const authHeader = request.headers.get('token')
	if (!authHeader || authHeader !== AUTH_TOKEN) {
		return new Response('401: unauthorized', { status: 401 })
	}

	const contentType = request.headers.get('content-type') || ''
	if (!contentType.includes('application/json')) {
		return new Response('400: invalid body', { status: 400 })
	}

	const bodyData: RequestBody = await request.json()

	const username = await getUserName(bodyData.userId)
	const roleName = await getRoleName(bodyData.groupId, bodyData.newRank)
	const csrf = await getCSRFToken()

	return new Response(`username: ${username}, role: ${roleName}, csrf: ${csrf}`)
}
