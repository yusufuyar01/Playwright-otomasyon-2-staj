import { test, expect } from '@playwright/test';
import { login } from '../../../helpers/login';
import { zoom } from '../../../helpers/zoom';

test('TechPOS - Seri No Grid Filtre', async ({ page }) => {
  
    console.log('===>  Techpos Seri No Grid Filtreleme  <===');

    // Bugünün tarihini konsola yazdır
    const bugun = new Date();
    const tarihString = bugun.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
    console.log(`📅 Bugünün tarihi: ${tarihString}`);

    // 60 gün öncesinin tarihini konsola yazdır
    const altmısırgunOncesi = new Date();
    altmısırgunOncesi.setDate(bugun.getDate() - 60);
    const altmısırgunOncesiString = altmısırgunOncesi.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
    console.log(`📅 60 gün öncesi: ${altmısırgunOncesiString}`);

    // Ay numarasını ay adına çeviren fonksiyon
    const ayAdiGetirTam = (ayNumarasi: number): string => {
        const aylar = [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
        return aylar[ayNumarasi - 1];
    };
    
    // Gün numarasını gün adına çeviren fonksiyon
    const gunAdiGetir = (gunNumarasi: number): string => {
        const gunler = [
            'Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 
            'Perşembe', 'Cuma', 'Cumartesi'
        ];
        return gunler[gunNumarasi];
    };  

    await login(page);
    
    await zoom(page);

    // Techpos yönetimi ve batch sayfasına git
    await page.getByText('Techpos Yönetimi').click();
    await page.getByRole('link', { name: ' Seri Numara Doğrulama' }).click();

    // Tarih filtreleme - başlangıç tarihi
    await page.locator('#datepicker-1').click();
    await page.waitForTimeout(1000);
    await page.locator('#datepicker-1').press('ArrowLeft');
    await page.locator('#datepicker-1').press('ArrowLeft');
    await page.waitForTimeout(1000);
    

    // Tarih string'ini oluştur
    const gun = altmısırgunOncesi.getDate();
    const ay = altmısırgunOncesi.getMonth() + 1;
    const yıl = altmısırgunOncesi.getFullYear();
    
    // Gün adını al
    await page.waitForTimeout(1000);

    // Tarih seçimi - GG.AA.YYYY formatında (numara olarak)
    console.log(`🔍  2 Ay Çncesi Seçildi`);
    const tarih = gun.toString() + ay.toString() + yıl.toString();
    if (gun.toString() !== '31') {
    const gunStr = ['3','4','5','6','7','8','9'].includes(gun.toString()) ? '0' + gun.toString() : gun.toString();
    const tarih = gunStr + ay.toString() + yıl.toString();
    }
    
    if (['1','3','5','7','8','10','12'].includes(ay.toString())) {
     await page.locator('#datepicker-1').click();
     for (let i = 0; i < yıl.toString().length; i++) {
     await page.locator('#datepicker-1').press(yıl.toString()[i]);
     await page.waitForTimeout(300); // Her karakter arasında kısa bekleme
     }
     await page.locator('#datepicker-1').press('ArrowLeft');
     for (let i = 0; i < ay.toString().length; i++) {
         await page.locator('#datepicker-1').press(ay.toString()[i]);
         await page.waitForTimeout(300); // Her karakter arasında kısa bekleme
     }
     await page.locator('#datepicker-1').press('ArrowLeft');
     await page.locator('#datepicker-1').press('ArrowLeft');
     for (let i = 0; i < gun.toString().length; i++) {
         await page.locator('#datepicker-1').press(gun.toString()[i]);
         await page.waitForTimeout(300); // Her karakter arasında kısa bekleme
     }
    } else {
        // Tarih string'ini karakterlerine ayır ve her birini ayrı ayrı bas
    for (let i = 0; i < tarih.length; i++) {
     await page.locator('#datepicker-1').press(tarih[i]);
     await page.waitForTimeout(300); // Her karakter arasında kısa bekleme
     }   
     }
     
     // Gün adını al
     const gunAdi = gunAdiGetir(altmısırgunOncesi.getDay());
     await page.waitForTimeout(1000);
 
     // Tarih seçimi
     const titleText = `${gun} ${ayAdiGetirTam(ay)} ${altmısırgunOncesi.getFullYear()} ${gunAdi}`;
     console.log(`🔍 Seçilecek başlangıç tarihi: "${titleText}"`);
 
   
    await page.locator('ot-data-entry-template').filter({ hasText: 'Bitiş Tarihi' }).getByLabel('Takvimden seç').click();
    await page.getByRole('button', { name: 'Bugün' }).click();

    // Filtrele butonu
    await page.getByRole('button', { name: 'Filtrele' }).click();

    await page.waitForTimeout(1000);

    if (await page.getByText('Kayıt bulunamadı').isVisible()) {
        console.log(' ❌ Kayıt bulunamadı');
        await page.pause();
    } else {
        console.log(' ✅ Kayıtlar bulundu');

        const seriNo = await page.getByRole('gridcell').nth(4).textContent();

        await page.getByRole('button', { name: '' }).click();
        await page.getByRole('textbox', { name: 'Seri Numarası Filter' }).click();
        await page.getByRole('textbox', { name: 'Seri Numarası Filter' }).fill(seriNo);

        await page.waitForTimeout(1000);

        if (await page.getByText('Kayıt bulunamadı').isVisible()) {
            console.log(' ❌ Kayıt bulunamadı');
            await page.pause();
        } else {
            console.log(' ✅ Grid filtre ile Kayıt bulundu');
    
            let i = 18;
            while (await page.getByRole('gridcell').nth(i).isVisible()) {
            const olusturulmaTarihi = await page.getByRole('gridcell').nth(i).textContent();
            const seriNo = await page.getByRole('gridcell').nth(i+2).textContent();
    
            console.log('➤ Oluşturulma tarihi', olusturulmaTarihi, ' olan ve Seri Numarası', seriNo, ' olan cihaz bulundu');
    
            console.log('--------------------------------');
    
            i = i + 16;
    
            }
        }   
    }

    await page.pause();
}); 