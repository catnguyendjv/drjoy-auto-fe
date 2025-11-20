#!/usr/bin/env node
/**
 * Generate Redmine Users TypeScript File
 * Fetches all users from Redmine API and creates a TypeScript file with user data
 */

const fs = require('fs');

async function main() {
  console.log('📦 Generating Redmine Users data...\n');

  // Read both JSON files
  console.log('📖 Reading user data from JSON files...');
  const data1 = JSON.parse(fs.readFileSync('users_raw.json', 'utf8'));
  const data2 = JSON.parse(fs.readFileSync('users_raw_2.json', 'utf8'));

  // Combine all users
  const allUsers = [...data1.users, ...data2.users];
  console.log(`   Found ${allUsers.length} total users`);

  // Sort by firstname alphabetically
  allUsers.sort((a, b) => {
    const nameA = (a.firstname || '').toLowerCase();
    const nameB = (b.firstname || '').toLowerCase();
    return nameA.localeCompare(nameB);
  });

  // Create formatted user list for select dropdown
  const userSelectOptions = allUsers.map(user => ({
    id: user.id,
    value: user.id,
    label: `${user.firstname} ${user.lastname} (${user.login})`,
    login: user.login,
    firstname: user.firstname,
    lastname: user.lastname,
    mail: user.mail,
    admin: user.admin,
    note: user.custom_fields?.find(cf => cf.id === 67)?.value || '',
    lastLoginOn: user.last_login_on
  }));

  // Count stats
  const activeUsers = allUsers.filter(u => u.last_login_on).length;
  const adminUsers = allUsers.filter(u => u.admin).length;

  // Generate TypeScript file
  const tsContent = `/**
 * Redmine Users Data
 * Auto-generated from Redmine API
 * Total users: ${allUsers.length}
 * Last updated: ${new Date().toISOString()}
 */

export interface RedmineUser {
  id: number;
  value: number;
  label: string;
  login: string;
  firstname: string;
  lastname: string;
  mail: string;
  admin: boolean;
  note: string;
  lastLoginOn: string | null;
}

export const REDMINE_USERS: RedmineUser[] = ${JSON.stringify(userSelectOptions, null, 2)};

/**
 * Get user by ID
 */
export const getUserById = (id: number): RedmineUser | undefined => {
  return REDMINE_USERS.find(user => user.id === id);
};

/**
 * Get user by login
 */
export const getUserByLogin = (login: string): RedmineUser | undefined => {
  return REDMINE_USERS.find(user => user.login === login);
};

/**
 * Get all active users (users who have logged in before)
 */
export const getActiveUsers = (): RedmineUser[] => {
  return REDMINE_USERS.filter(user => user.lastLoginOn !== null);
};

/**
 * Get users for select options (id and label)
 */
export const getUserOptions = () => {
  return REDMINE_USERS.map(user => ({
    value: user.id,
    label: user.label
  }));
};

/**
 * Get active users for select options
 */
export const getActiveUserOptions = () => {
  return getActiveUsers().map(user => ({
    value: user.id,
    label: user.label
  }));
};
`;

  console.log('💾 Writing TypeScript file...');
  fs.writeFileSync('src/lib/redmine-users.ts', tsContent, 'utf8');

  console.log('\n✅ Successfully generated src/lib/redmine-users.ts\n');
  console.log('📊 Statistics:');
  console.log(`   - Total users: ${allUsers.length}`);
  console.log(`   - Active users (logged in): ${activeUsers}`);
  console.log(`   - Admin users: ${adminUsers}`);
  console.log('\n✨ Done!\n');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
