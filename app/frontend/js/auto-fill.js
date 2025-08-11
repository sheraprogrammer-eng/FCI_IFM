document.addEventListener('DOMContentLoaded', function () {
  // Helpers
  function setValue(selector, value) {
    const el = document.querySelector(selector);
    if (!el) return false;
    if (el.value && String(el.value).trim() !== '') return true;
    el.value = value;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    return true;
  }

  function setChecked(selector) {
    const el = document.querySelector(selector);
    if (!el) return false;
    if (el.checked) return true;
    el.checked = true;
    el.dispatchEvent(new Event('change'));
    return true;
  }

  function selectFirstOption(selector) {
    const el = document.querySelector(selector);
    if (!el || el.tagName !== 'SELECT') return false;
    if (el.value && String(el.value).trim() !== '') return true;
    if (el.options.length > 1) {
      el.selectedIndex = 1;
    } else if (el.options.length > 0) {
      el.selectedIndex = 0;
    }
    el.dispatchEvent(new Event('change'));
    el.dispatchEvent(new Event('input'));
    return true;
  }

  function fillText(selector, text) {
    const el = document.querySelector(selector);
    if (!el) return false;
    if (el.value && String(el.value).trim() !== '') return true;
    el.value = text;
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    return true;
  }

  function fillNumber(selector, num) {
    return fillText(selector, String(num));
  }

  function fillDate(selector, dateStr) {
    return fillText(selector, dateStr);
  }

  // Main autofill
  function autoFillForm() {
    try {
      const form = document.getElementById('insuranceForm');
      if (!form) return;

      // Basic identity
      selectFirstOption('select[name="Cust_Salutation"]');
      fillText('input[name="Cust_FirstName"]', 'สมชาย');
      fillText('input[name="Cust_LastName"]', 'ทดสอบ');
      setChecked('input[type="radio"][name="Insured_Gender"][value="ชาย"]');
      // วันเกิด - ลองหลายรูปแบบ
      const dobField = document.querySelector('input[name="Insured_DOB"]');
      if (dobField) {
        dobField.value = '01-08-1988';
        dobField.dispatchEvent(new Event('input', { bubbles: true }));
        dobField.dispatchEvent(new Event('change', { bubbles: true }));
        dobField.dispatchEvent(new Event('blur', { bubbles: true }));
        // ลองรูปแบบอื่น
        if (!dobField.value) {
          dobField.value = '1988-08-01';
          dobField.dispatchEvent(new Event('input', { bubbles: true }));
          dobField.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
      fillNumber('input[name="Insured_Height_Heal"]', 170);
      fillNumber('input[name="Insured_Weight_Heal"]', 65);
      fillText('input[name="race"]', 'ไทย');
      fillText('input[name="nationality"]', 'ไทย');
      fillText('input[name="Insured_NationalID"]', '1234567890123');
      fillText('input[name="passport"]', '123456789');
      fillText('input[name="Cust_Address"]', '123');
      fillNumber('input[name="address_moo"]', 1);
      fillText('input[name="address_village"]', 'หมู่บ้านทดสอบ');
      fillText('input[name="address_soi"]', 'สุขุมวิท 10');
      fillText('input[name="address_road"]', 'สุขุมวิท');
      fillText('input[name="Cust_Telephone3"]', '021234000');
      fillText('input[name="Cust_Telephone1"]', '0800000000');
      fillText('input[name="Insured_Email_Address"]', 'test@example.com');
      selectFirstOption('select[name="Insured_Occupation"]');
      fillDate('input[name="Policy_EffectiveDate"]', '2025-01-01');
      fillText('textarea[name="Insured_Occupation_Detail"]', 'พนักงานออฟฟิศ');

      // Payment info
      selectFirstOption('select[name="Payment_Type"]');
      selectFirstOption('select[name="Payment_Method"]');
      selectFirstOption('select[name="paytype_card"]');
      selectFirstOption('select[name="paytype_card1"]');
      fillText('input[name="account_number"]', '4111111111111111');
      fillText('input[name="card_expiry"]', '12/29');
      fillText('input[name="card_holder_name"]', 'TEST USER');
      selectFirstOption('select[name="card_relation"]');

      // Credit info
      fillText('input[name="Credit_IDCard"]', '4111111111111111');
      fillText('input[name="Credit_CardName"]', 'TEST USER');
      fillText('input[name="Credit_Type"]', 'VISA');
      fillText('input[name="Card_Issuer_Bank"]', 'KBANK');
      fillText('input[name="CreditCardExpDate"]', '12/29');
      fillText('input[name="Approve_Code"]', 'APPROV');

      // Insurance type for plan calculation
      selectFirstOption('select[name="insurance_type"]');

      // Beneficiaries
      // 1
      selectFirstOption('select[name="Benefit1_Salutation"]');
      fillText('input[name="Benefit1_FirstName"]', 'ผู้รับ1');
      fillText('input[name="Benefit1_LastName"]', 'ทดสอบ');
      selectFirstOption('select[name="Benefit1_Relation"]');
      fillNumber('input[name="Benefit1_Rate"]', 25);
      // 2
      selectFirstOption('select[name="Benefit2_Salutation"]');
      fillText('input[name="Benefit2_FirstName"]', 'ผู้รับ2');
      fillText('input[name="Benefit2_LastName"]', 'ทดสอบ');
      selectFirstOption('select[name="Benefit2_Relation"]');
      fillNumber('input[name="Benefit2_Rate"]', 25);
      // 3
      selectFirstOption('select[name="Benefit3_Salutation"]');
      fillText('input[name="Benefit3_FirstName"]', 'ผู้รับ3');
      fillText('input[name="Benefit3_LastName"]', 'ทดสอบ');
      selectFirstOption('select[name="Benefit3_Relation"]');
      fillNumber('input[name="Benefit3_Rate"]', 25);
      // 4 (optional)
      selectFirstOption('select[name="Benefit4_Salutation"]');
      fillText('input[name="Benefit4_FirstName"]', 'ผู้รับ4');
      fillText('input[name="Benefit4_LastName"]', 'ทดสอบ');
      selectFirstOption('select[name="Benefit4_Relation"]');
      fillNumber('input[name="Benefit4_Rate"]', 25);
      // leave rate empty to allow sum <= 100

      // UW questions + IDs
      setChecked('input[type="radio"][name="Ins1_UW1"][value="ไม่เคย"]');
      setChecked('input[type="radio"][name="Ins1_UW2"][value="ไม่เคย"]');
      setChecked('input[type="radio"][name="Ins1_UW3"][value="ไม่เคย"]');
      setChecked('input[type="radio"][name="Ins1_UW4"][value="ไม่สูบ/ไม่เสพ"]');
      setChecked('input[type="radio"][name="Ins1_UW5"][value="ไม่ดื่ม"]');
      fillNumber('input[name="Ins1_UW1_ID"]', 0);
      fillNumber('input[name="Ins1_UW2_ID"]', 0);
      fillNumber('input[name="Ins1_UW3_ID"]', 0);
      fillNumber('input[name="Ins1_UW4_ID"]', 0);
      fillNumber('input[name="Ins1_UW5_ID"]', 0);
      fillText('textarea[name="Ins1_UW1_Des"]', 'ไม่มี');
      fillText('textarea[name="Ins1_UW2_Des"]', 'ไม่มี');
      fillText('textarea[name="Ins1_UW3_Des"]', 'ไม่มี');
      fillText('textarea[name="Ins1_UW4_Des"]', 'ไม่สูบบุหรี่');
      fillNumber('input[name="smoke9_amount"]', 0);
      fillText('textarea[name="Ins1_UW5_Des"]', 'ไม่ดื่มเหล้า');
      fillNumber('input[name="drink10_amount"]', 0);

      // Sales / Misc
      fillText('input[name="t_tsrName"]', 'Test Seller');

      // Consents
      setChecked('input[type="radio"][name="tax"][value="มีความประสงค์"]');
      fillText('input[name="taxid"]', '1234567890123');
      setChecked('input[type="radio"][name="data_consent"][value="ยินยอม"]');
      setChecked('input[name="E_Policy"]');
      fillText('input[name="agent_id"]', 'AGENT001');
      fillText('textarea[name="remarks"]', 'ข้อมูลทดสอบ');

      // Address cascading
      const provinceSelect = document.querySelector('select[name="Cust_Province"]');
      if (provinceSelect) {
        if (!provinceSelect.value) {
          if (provinceSelect.options.length > 1) provinceSelect.selectedIndex = 1;
          provinceSelect.dispatchEvent(new Event('change'));
        }
        setTimeout(() => {
          const amphurSel = document.querySelector('select[name="Cust_Amphur"]');
          if (amphurSel && !amphurSel.value) {
            if (amphurSel.options.length > 1) amphurSel.selectedIndex = 1;
            amphurSel.dispatchEvent(new Event('change'));
          }
          setTimeout(() => {
            const districtSel = document.querySelector('select[name="Cust_District"]');
            if (districtSel && !districtSel.value) {
              if (districtSel.options.length > 1) districtSel.selectedIndex = 1;
              districtSel.dispatchEvent(new Event('change'));
            }
          }, 500);
        }, 500);
      }

      // Trigger age calculation
      setTimeout(() => {
        const ageField = document.getElementById('age');
        const dobField = document.querySelector('input[name="Insured_DOB"]');
        if (dobField && ageField) {
          dobField.dispatchEvent(new Event('input', { bubbles: true }));
          dobField.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, 1000);

      console.log('Form auto-filled successfully!');
    } catch (err) {
      console.error('Auto-fill error:', err);
    }
  }

  // เรียกใช้งาน autofill หลังจากหน้าเว็บโหลดเสร็จ
  setTimeout(autoFillForm, 2000);
});
