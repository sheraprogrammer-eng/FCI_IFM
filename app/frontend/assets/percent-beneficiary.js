// ตรวจสอบเปอร์เซนต์ผู้รับประโยชน์รวมกันไม่เกิน 100% และแสดงผลรวมแบบ realtime พร้อม revert ถ้าเกิน
const percentInputs = ['percent_1','percent_2','percent_3','percent_4'];
const prevValues = {};
percentInputs.forEach(function(name) {
    let el = document.querySelector('input[name="'+name+'"]');
    if (el) {
        prevValues[name] = el.value;
        el.addEventListener('focus', function() {
            prevValues[name] = this.value;
        });
        el.addEventListener('input', function() {
            if (parseInt(this.value) < 0) this.value = 0;
            checkPercentSum(false);
            prevValues[name] = this.value;
        });
        el.addEventListener('blur', function(e) {
            let sum = getPercentSum();
            if (sum > 100) {
                showPercentWarning(this);
                setTimeout(() => {
                    this.focus();
                    this.select();
                }, 10);
            }
        });
    }
});
window.addEventListener('DOMContentLoaded', function() {
    checkPercentSum(false);
});
function getPercentSum() {
    let p1 = parseInt(document.querySelector('input[name="percent_1"]').value) || 0;
    let p2 = parseInt(document.querySelector('input[name="percent_2"]').value) || 0;
    let p3 = parseInt(document.querySelector('input[name="percent_3"]').value) || 0;
    let p4 = parseInt(document.querySelector('input[name="percent_4"]').value) || 0;
    return p1 + p2 + p3 + p4;
}
function checkPercentSum(showAlert = true) {
    let sum = getPercentSum();
    var percentSumDisplay = document.getElementById('percentSumDisplay');
    if (percentSumDisplay) {
        percentSumDisplay.textContent = 'เปอร์เซนต์รวม: ' + sum + '%';
        percentSumDisplay.style.color = (sum > 100) ? '#dc3545' : '#0a3556';
    }
    return sum <= 100;
}
// Popup เตือนเปอร์เซนต์รวมเกิน 100%
function showPercentWarning(triggerInput) {
    if (document.getElementById('percentWarningPopup')) return;
    let popup = document.createElement('div');
    popup.id = 'percentWarningPopup';
    popup.style.position = 'fixed';
    popup.style.top = '0';
    popup.style.left = '0';
    popup.style.width = '100vw';
    popup.style.height = '100vh';
    popup.style.background = 'rgba(0,0,0,0.5)';
    popup.style.display = 'flex';
    popup.style.alignItems = 'center';
    popup.style.justifyContent = 'center';
    popup.style.zIndex = '20000';
    popup.innerHTML = `<div style='background:#fff;padding:30px 40px;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.18);text-align:center;max-width:90vw;'>
        <div style='font-size:1.2rem;color:#dc3545;font-weight:600;margin-bottom:10px;'><i class=\"fas fa-exclamation-triangle me-2\"></i>เปอร์เซนต์รวมเกิน 100%</div>
        <div style='margin-bottom:18px;'>กรุณาตรวจสอบเปอร์เซนต์ผู้รับประโยชน์รวมกันต้องไม่เกิน 100%</div>
        <button id="percentWarningBtn2" style='background:#dc3545;color:#fff;border:none;border-radius:8px;padding:8px 28px;font-size:1rem;cursor:pointer;'>ตกลง</button>
    </div>`;
    document.body.appendChild(popup);
    document.body.style.overflow = 'hidden';
    setTimeout(function() {
        document.getElementById('percentWarningBtn2').onclick = function() {
            popup.remove();
            document.body.style.overflow = '';
        };
    }, 100);
}