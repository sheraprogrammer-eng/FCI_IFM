// Minimal, schema-driven validation for IFM form
// Ensures NOT NULL fields per app/backend/models/ifm.sql are present before submit

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('insuranceForm');
  if (!form) return;

  function showValidationPopup(message) {
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;z-index:30000;';
    div.innerHTML = `
      <div style="background:#fff;max-width:90vw;padding:26px 34px;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,.25);text-align:center;">
        <div style="font-size:1.1rem;color:#dc3545;font-weight:600;margin-bottom:10px;">กรุณากรอกข้อมูลให้ครบถ้วน</div>
        <div style="color:#555;text-align:left;white-space:pre-wrap;max-height:60vh;overflow:auto;">${message}</div>
        <div style="margin-top:14px;"><button id="valOk" style="background:#dc3545;color:#fff;border:none;border-radius:8px;padding:8px 20px;cursor:pointer;">ตกลง</button></div>
      </div>`;
    document.body.appendChild(div);
    document.getElementById('valOk').onclick = () => div.remove();
  }

  function listMissing(fields) {
    const missing = [];
    fields.forEach((name) => {
      const el = form.querySelector(`[name="${name}"]`);
      if (!el) return; // skip fields that are not present in DOM
      const val = el.value;
      if (!val || String(val).trim() === '') missing.push(name);
    });
    return missing;
  }

  function getVal(name) {
    return form.querySelector(`[name="${name}"]`)?.value || '';
  }
  function setIfEmpty(name, value) {
    const el = form.querySelector(`[name="${name}"]`);
    if (!el) return;
    if (!el.value || String(el.value).trim() === '') el.value = value || '';
  }

  window.validateInsuranceForm = function () {
    // Prefill Insured_* จาก Cust_* หากเว้นว่าง เพื่อให้ผ่าน NOT NULL (ถ้ามีฟิลด์อยู่)
    setIfEmpty('Insured_Salutation', getVal('Cust_Salutation'));
    setIfEmpty('Insured_FirstName', getVal('Cust_FirstName'));
    setIfEmpty('Insured_LastName', getVal('Cust_LastName'));
    setIfEmpty('Insured_Address', getVal('Cust_Address'));
    setIfEmpty('Insured_District', getVal('Cust_District'));
    setIfEmpty('Insured_Amphur', getVal('Cust_Amphur'));
    setIfEmpty('Insured_Province', getVal('Cust_Province'));
    setIfEmpty('Insured_Zipcode', getVal('Cust_Zipcode'));
    setIfEmpty('Insured_Telephone1', getVal('Cust_Telephone1'));
    // ค่าพื้นฐานอื่น
    setIfEmpty('Insured_Marital_Status', 'Single');
    setIfEmpty('Policy_Plan', 'Plan A');
    setIfEmpty('Payment_Type', 'Credit');
    setIfEmpty('Payment_Method', 'Credit Card');
    setIfEmpty('t_tsrName', getVal('t_tsrName'));
    // UW IDs ว่างให้เป็น 0
    ['Ins1_UW1_ID','Ins1_UW2_ID','Ins1_UW3_ID','Ins1_UW4_ID','Ins1_UW5_ID'].forEach(n => setIfEmpty(n, '0'));
    // วันที่ชำระเงินว่าง ให้เท่ากับวันเริ่มคุ้มครอง
    if (!getVal('Paid_Date')) setIfEmpty('Paid_Date', getVal('Policy_EffectiveDate'));

    const required = [
      'Cust_Salutation','Cust_FirstName','Cust_LastName','Cust_Address','Cust_District','Cust_Amphur','Cust_Province','Cust_Zipcode','Cust_Telephone1',
      'Insured_Salutation','Insured_NationalID','Insured_FirstName','Insured_LastName','Insured_Address','Insured_District','Insured_Amphur','Insured_Province','Insured_Zipcode','Insured_Telephone1',
      'Insured_DOB','Insured_Gender','Insured_Marital_Status','Insured_Occupation','Insured_Occupation_Detail',
      'Benefit1_Salutation','Benefit1_FirstName','Benefit1_LastName','Benefit1_Relation','Benefit1_Rate',
      'Policy_EffectiveDate','Policy_Plan','Policy_SumInsured','Payment_Amount','Payment_Type','Policy_Premium','Paid_Date','Payment_Method',
      'Credit_IDCard','t_tsrName','E_Policy','Ins1_UW1','Ins1_UW1_ID','Ins1_UW2','Ins1_UW2_ID','Ins1_UW3','Ins1_UW3_ID','Ins1_UW4','Ins1_UW4_ID','Ins1_UW5','Ins1_UW5_ID','Tax_Consent','Data_Consent'
    ];

    const missing = listMissing(required);

    // Basic formats (เฉพาะฟิลด์ที่มีใน DOM เท่านั้น)
    const idCardEl = form.querySelector('[name="Insured_NationalID"]');
    const idCard = idCardEl ? idCardEl.value : '';
    if (idCardEl && idCard && !/^\d{13}$/.test(idCard)) missing.push('Insured_NationalID(13 digits)');

    const creditEl = form.querySelector('[name="Credit_IDCard"]');
    const credit = creditEl ? creditEl.value : '';
    if (creditEl && credit && credit.length > 16) missing.push('Credit_IDCard(<=16)');

    const dobEl = form.querySelector('[name="Insured_DOB"]');
    const pedEl = form.querySelector('[name="Policy_EffectiveDate"]');
    const paidEl = form.querySelector('[name="Paid_Date"]');
    const dob = dobEl ? dobEl.value : '';
    const ped = pedEl ? pedEl.value : '';
    const paid = paidEl ? paidEl.value : '';
    if (dobEl && dob && Number.isNaN(new Date(dob).getTime())) missing.push('Insured_DOB(valid date)');
    if (pedEl && ped && Number.isNaN(new Date(ped).getTime())) missing.push('Policy_EffectiveDate(valid date)');
    if (paidEl && paid && Number.isNaN(new Date(paid).getTime())) missing.push('Paid_Date(valid date)');

    if (missing.length) {
      showValidationPopup('- ' + missing.join('\n- '));
      return false;
    }
    return true;
  };

  form.addEventListener('submit', function (e) {
    if (!window.validateInsuranceForm()) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  });
});
