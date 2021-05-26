export const getCSRFToken = async () => {
	let res: Response

	try {
		res = await fetch('https://auth.roblox.com/v2/logout', {
			method: 'POST',
			headers: {
				cookie: `.ROBLOXSECURITY=${ROBLOX_COOKIE}`,
			},
		})
	} catch (err) {
		console.log('hihi')
		console.log(err)
		throw 'idk'
	}

	const token = res.headers.get('x-csrf-token')
	if (!token) {
		throw new Error('invalid csrf token')
	}

	return token
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

export const getRoleName = async (groupId: number, roleId: number) => {
	const groupRolesRes = await fetch(
		`https://groups.roblox.com/v1/groups/${groupId}/roles`,
	)

	const contentType = groupRolesRes.headers.get('content-type') || ''
	if (!contentType.includes('application/json')) {
		return '<API Error 1>'
	}

	const data: GroupRoles = await groupRolesRes.json()

	for (const role of data.roles) {
		if (role.rank === roleId) {
			return role.name
		}
	}

	return '<API Error 2>'
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
