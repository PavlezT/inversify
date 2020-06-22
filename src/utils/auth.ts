import * as bcrypt from 'bcrypt';

export async function checkUserPassword(password, passwordHash) {
	const match = await bcrypt.compare(password, passwordHash);
	return match;
}