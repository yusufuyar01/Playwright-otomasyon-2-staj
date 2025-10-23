import { test, expect } from '@playwright/test';
import { login } from '../../../helpers/login';
import { zoom } from '../../../helpers/zoom';

test('BKM TechPOS - Banka PF İşlem Listesi', async ({ page }) => {
  
    console.log('===>  BKM Techpos Banka PF İşlem Listesi  <===');

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

    // Techpos yönetimi ve BKM banka PF işlem listesi sayfasına git
    await page.getByText('Techpos Yönetimi').click();
    await page.getByRole('link', { name: 'BKM Techpos Banka / PF İşlem Listesi' }).click();

    await page.getByText('Seçiniz...').first().click();
    await page.getByRole('option', { name: 'SİPAY', exact: true }).click();
    await page.getByText('Seçiniz...').click();
    await page.getByRole('option', { name: 'AKTİF YATIRIM BANKASI A.Ş' }).click();

    // Başlangıç ve Bitiş Tarihi

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
    await page.waitForTimeout(1000);

    // Filtrele butonuna tıkla
    await page.getByRole('button', { name: 'Filtrele' }).click();
    await page.waitForTimeout(3000);

    // "Kayıt bulunamadı" mesajının görünüp görünmediğini kontrol et
    const kayitBulunamadiElement = page.getByText('Kayıt bulunamadı');
    const isKayitBulunamadiVisible = await kayitBulunamadiElement.isVisible();

    if (isKayitBulunamadiVisible) {
        console.log('❌ Kayıt bulunamadı');
        await page.pause();
    } else {
        console.log('✅ Kayıtlar bulundu');

        
        console.log('➤ İlk Ödeme Tarihi', gun, ay, yıl);
        console.log('➤ Bugün', bugun.getDate(), bugun.getMonth() + 1, bugun.getFullYear());

        console.log('--------------------------------');
        console.log('Aktif Yatırım ilk 3 satır Tarihleri');
        let i = 16;
        let j = 3;

        while (await page.getByRole('gridcell').nth(i).isVisible() && j > 0) {
        const tarih = await page.getByRole('gridcell').nth(i).textContent();
        console.log('➤ Tarih', tarih);

        i = i + 22;
        j = j - 1;
        }
    }

    console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');

    await page.getByLabel('Hepsi').getByText('AKTİF YATIRIM BANKASI A.Ş').click();
    await page.getByRole('option', { name: 'T.C MERKEZ BANKASI' }).click();

    // filtrele butonuna tıkla
    await page.getByRole('button', { name: 'Filtrele' }).click();
    await page.waitForTimeout(3000);



    if (isKayitBulunamadiVisible) {
        console.log('❌ Kayıt bulunamadı');
        await page.pause();
    } else {
        console.log('✅ Kayıtlar bulundu');

    
    console.log('➤ İlk Ödeme Tarihi', gun, ay, yıl);
    console.log('➤ Bugün', bugun.getDate(), bugun.getMonth() + 1, bugun.getFullYear());

    console.log('--------------------------------');    
    console.log('Merkez Bankası ilk 3 satır Tarihleri');
    let i = 16;
    let j = 3;

    while (await page.getByRole('gridcell').nth(i).isVisible() && j > 0) {
    const tarih = await page.getByRole('gridcell').nth(i).textContent();
    console.log('➤ Tarih', tarih);

    i = i + 22;
    j = j - 1;
    }
}


    await page.pause();
}); 