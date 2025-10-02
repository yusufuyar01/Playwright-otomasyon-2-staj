// helpers/login.ts
import { Page } from '@playwright/test';

export async function login(page: Page): Promise<void> {
  
  // ===== ADIM 1: Sayfaya Gitme =====
  // OverPay Reseller Dashboard sayfasına yönlendirme
  await page.goto('https://overpayresellerdemo.overtech.com.tr/login');
  
  // Sayfanın yüklenmesini bekle
  await page.waitForLoadState('networkidle');
  
  // ===== ADIM 2: Kullanıcı Adı ve Şifre Girişi =====
  // Kullanıcı adı alanını bul ve doldur
  const usernameInput = page.locator('input[type="text"], input[name="username"], input[id="username"], #UserName');
  await usernameInput.fill('pavo.admin'); // Gerçek kullanıcı adınızı buraya yazın
  
  const passwordInput = page.locator('input[type="password"], input[name="password"], input[id="password"], #Password');
  await passwordInput.fill('1234'); // Gerçek şifrenizi buraya yazın
  

  // ===== ADIM 3: Giriş Butonuna Tıklama =====
  // Giriş butonunu bul ve tıkla
  const loginButton = page.locator('button[type="submit"], input[type="submit"],  #loginButton');
  await loginButton.click();


  // ===== ADIM 4: Test Sonucu =====
  // Test tamamlandı, 7 saniye bekle ve browser'ı kapat
  await page.waitForTimeout(3000);
  console.log('Admin ile giriş yapıldı');

}

export async function logout(page: Page): Promise<void> {

  await page.getByText('P', { exact: true }).first().click();
  await page.getByText('Çıkış').click();
  console.log('Admin ile çıkış yapıldı');
  await page.waitForTimeout(1000);


}