export const getCSRFToken = async () => {
	let res: Response

  res = await fetch('https://auth.roblox.com/v2/logout', {
    method: 'POST',
    headers: {
      cookie: `.ROBLOSECURITY=${ROBLOX_COOKIE}`,
    },
  })
  
  const token = res.headers.get('x-csrf-token')
  
	if (!token) {
		throw new Error('invalid csrf token')
	}

	return token
}

export const setUserRank = async (groupId: number, userId: number, rank: number) => {
	const roleSet = await getRoleSet(groupId, rank)
	
  const body = {
    roleId: roleSet.id
	}
	
	const csrf = await getCSRFToken()

  const url = `https://groups.roblox.com/v1/groups/${groupId}/users/${userId}`
  const init: RequestInit = {
		body: JSON.stringify(body),
		method: "PATCH",
		headers: {
			"content-type": "application/json",
			"X-CSRF-TOKEN": csrf,
			cookie: `.ROBLOSECURITY=${ROBLOX_COOKIE}`,
		}
	}
	
	const res = await fetch(url, init)

	if (res.status !== 200) {
		throw "failed to promote user"
	}
}

interface GroupRole {
	id: number
	name: string
	rank: number
	memberCount: number
}
interface GroupRoles {
	groupId: string
	roles: Array<GroupRole>
}

export const getRoleSet = async (groupId: number, rank: number) => {
	const groupRolesRes = await fetch(
		`https://groups.roblox.com/v1/groups/${groupId}/roles`,
	)

  if (groupRolesRes.status !== 200) {
    throw "invalid group"
  }

	const data: GroupRoles = await groupRolesRes.json()

	for (const role of data.roles) {
		if (role.rank === rank) {
			return role
		}
	}

	throw "invalid roleset"
}

interface RobloxUser {
	description: string
	created: string
	isBanned: boolean
	id: number
	name: string
	displayName: string
}

export const getUserName = async (userId: number) => {
	const userRes = await fetch(`https://users.roblox.com/v1/users/${userId}`)

	const contentType = userRes.headers.get('content-type') || ''
	if (!contentType.includes('application/json')) {
		return '<API Error>'
	}

	const data: RobloxUser = await userRes.json()

	return data.name
}
