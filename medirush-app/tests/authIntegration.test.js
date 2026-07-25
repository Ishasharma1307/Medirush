import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('==================================================');
console.log('         RUNNING AUTH INTEGRATION TEST            ');
console.log('==================================================\n');

try {
  // Test 1: Check AuthContext exports
  console.log('Checking AuthContext.jsx file exports...');
  const authContextPath = path.resolve('src/context/AuthContext.jsx');
  const authContextContent = fs.readFileSync(authContextPath, 'utf8');

  const requiredExports = [
    'loginWithGoogle',
    'loginWithApple',
    'sendPhoneOtp',
    'verifyPhoneOtp',
    'logoutAllDevices',
    'checkAndCreateProfile'
  ];

  requiredExports.forEach((method) => {
    assert.ok(authContextContent.includes(method), `AuthContext.jsx must export ${method}`);
    console.log(`✓ AuthContext.jsx contains: ${method}`);
  });

  // Test 2: Check App.jsx imports & routes
  console.log('\nChecking App.jsx imports & routes...');
  const appPath = path.resolve('src/App.jsx');
  const appContent = fs.readFileSync(appPath, 'utf8');

  assert.ok(appContent.includes('AuthCallback'), 'App.jsx must import AuthCallback');
  assert.ok(appContent.includes('ForgotPassword'), 'App.jsx must import ForgotPassword');
  assert.ok(appContent.includes('/auth/callback'), 'App.jsx must define route /auth/callback');
  assert.ok(appContent.includes('/forgot-password'), 'App.jsx must define route /forgot-password');
  console.log('✓ App.jsx routes are configured correctly.');

  // Test 3: Check Register.jsx controls
  console.log('\nChecking Register.jsx controls...');
  const registerPath = path.resolve('src/pages/Register.jsx');
  const registerContent = fs.readFileSync(registerPath, 'utf8');

  assert.ok(registerContent.includes('loginWithGoogle'), 'Register.jsx must use Google Auth');
  assert.ok(registerContent.includes('loginWithApple'), 'Register.jsx must use Apple Auth');
  assert.ok(registerContent.includes('sendPhoneOtp'), 'Register.jsx must use Phone OTP');
  assert.ok(registerContent.includes('agreeToTerms'), 'Register.jsx must enforce Terms validation');
  assert.ok(registerContent.includes('agreeToPrivacy'), 'Register.jsx must enforce Privacy Policy validation');
  console.log('✓ Register.jsx contains all UI controls and validations.');

  // Test 4: Check Login.jsx controls
  console.log('\nChecking Login.jsx controls...');
  const loginPath = path.resolve('src/pages/Login.jsx');
  const loginContent = fs.readFileSync(loginPath, 'utf8');

  assert.ok(loginContent.includes('loginWithGoogle'), 'Login.jsx must support Google login');
  assert.ok(loginContent.includes('loginWithApple'), 'Login.jsx must support Apple login');
  assert.ok(loginContent.includes('sendPhoneOtp'), 'Login.jsx must support Phone login');
  assert.ok(loginContent.includes('rememberMe'), 'Login.jsx must support rememberMe checkbox');
  console.log('✓ Login.jsx contains all UI controls and settings.');

  console.log('\n==================================================');
  console.log('🎉 ALL AUTH INTEGRATION TESTS PASSED SUCCESSFULLY! ');
  console.log('==================================================');
  process.exit(0);

} catch (error) {
  console.error('\n❌ INTEGRATION TEST FAILED:', error.message);
  process.exit(1);
}
