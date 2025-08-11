// Flatpickr datepicker configuration
document.addEventListener('DOMContentLoaded', function() {
    // Flatpickr for birth date
    flatpickr("#Insured_DOB", {
        altInput: true,
        altFormat: "d-m-Y",
        dateFormat: "Y-m-d",
        locale: "th",
        allowInput: false,
        maxDate: "today",
        monthSelectorType: "dropdown",
        onChange: function(selectedDates, dateStr, instance) {
            if (selectedDates.length > 0) {
                const birth = selectedDates[0];
                const today = new Date();
                let age = today.getFullYear() - birth.getFullYear();
                const m = today.getMonth() - birth.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                    age--;
                }
                document.getElementById('age').value = age >= 0 ? age : '';
            } else {
                document.getElementById('age').value = '';
            }
        },
        onReady: function(selectedDates, dateStr, instance) {
            setTimeout(function() { convertFlatpickrYearToBuddhist(instance); }, 5);
            // คำนวณอายุเมื่อโหลด popup
            if (selectedDates.length > 0) {
                const birth = selectedDates[0];
                const today = new Date();
                let age = today.getFullYear() - birth.getFullYear();
                const m = today.getMonth() - birth.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                    age--;
                }
                document.getElementById('age').value = age >= 0 ? age : '';
            } else {
                document.getElementById('age').value = '';
            }
        },
        onMonthChange: function(selectedDates, dateStr, instance) {
            setTimeout(function() { convertFlatpickrYearToBuddhist(instance); }, 5);
        },
        onYearChange: function(selectedDates, dateStr, instance) {
            setTimeout(function() { convertFlatpickrYearToBuddhist(instance); }, 5);
        },
        onOpen: function(selectedDates, dateStr, instance) {
            setTimeout(function() { convertFlatpickrYearToBuddhist(instance); }, 5);
        }
    });

    // Flatpickr for start date
    flatpickr("input[name='Policy_EffectiveDate']", {
        altInput: true,
        altFormat: "d-m-Y",
        dateFormat: "Y-m-d",
        locale: "th",
        allowInput: false,
        monthSelectorType: "dropdown",
        onReady: function(selectedDates, dateStr, instance) {
            setTimeout(function() { convertFlatpickrYearToBuddhist(instance); }, 5);
        },
        onMonthChange: function(selectedDates, dateStr, instance) {
            setTimeout(function() { convertFlatpickrYearToBuddhist(instance); }, 5);
        },
        onYearChange: function(selectedDates, dateStr, instance) {
            setTimeout(function() { convertFlatpickrYearToBuddhist(instance); }, 5);
        },
        onOpen: function(selectedDates, dateStr, instance) {
            setTimeout(function() { convertFlatpickrYearToBuddhist(instance); }, 5);
        }
    });
});

function convertFlatpickrYearToBuddhist(instance) {
    const fp = instance || (window.flatpickr && window.flatpickr.instances[0]);
    if (!fp) return;
    const calendarContainer = fp.calendarContainer;
    if (!calendarContainer) return;
    
    // เฉพาะ .cur-year เท่านั้น (input หรือ span ปี)
    const yearElements = calendarContainer.querySelectorAll(".flatpickr-current-month .cur-year");
    yearElements.forEach(function(el) {
        const year = parseInt(el.value || el.textContent, 10);
        if (!isNaN(year) && year < 2500) {
            if (el.value !== undefined) {
                el.value = (year + 543).toString();
            } else {
                el.textContent = (year + 543).toString();
            }
        }
        
        // เพิ่ม event ให้พิมพ์ปี พ.ศ. ได้
        if (el.tagName === 'INPUT' && !el._buddhistYearHandler) {
            el._buddhistYearHandler = true;
            el.addEventListener('change', function(e) {
                let val = parseInt(this.value, 10);
                if (!isNaN(val) && val >= 2500 && val <= 2700) {
                    // setDate เป็น ค.ศ. ตรงกับ พ.ศ. ที่กรอก
                    const month = fp.currentMonth;
                    const day = fp.selectedDates[0] ? fp.selectedDates[0].getDate() : 1;
                    const year = val - 543;
                    fp.setDate(new Date(year, month, day), true);
                }
            });
            el.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    let val = parseInt(this.value, 10);
                    if (!isNaN(val) && val >= 2500 && val <= 2700) {
                        const month = fp.currentMonth;
                        const day = fp.selectedDates[0] ? fp.selectedDates[0].getDate() : 1;
                        const year = val - 543;
                        fp.setDate(new Date(year, month, day), true);
                        fp.close();
                    }
                }
            });
        }
    });
    
    // สำหรับ dropdown ปี (ถ้ามี)
    const yearDropdowns = calendarContainer.querySelectorAll("select.flatpickr-yearDropdown-year");
    yearDropdowns.forEach(function(el) {
        for (let i = 0; i < el.options.length; i++) {
            const year = parseInt(el.options[i].value, 10);
            if (!isNaN(year) && year < 2500) {
                el.options[i].text = (year + 543).toString();
            }
        }
    });
}