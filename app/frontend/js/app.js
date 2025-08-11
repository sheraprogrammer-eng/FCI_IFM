let percent = 0;
let loadingInterval;
let loadingStartTime = Date.now();
const maxLoadingTime = 3000; // 3 seconds max

$(document).ready(function() {
    // Loading animation
    loadingInterval = setInterval(function() {
        const elapsed = Date.now() - loadingStartTime;
        const progress = Math.min(elapsed / maxLoadingTime, 1);
        
        // Smooth progress with easing
        percent = progress * 100;
        $('#loading-percent').text(Math.floor(percent) + '%');
        
        if (percent >= 100 || elapsed >= maxLoadingTime) {
            percent = 100;
            $('#loading-percent').text('100%');
            clearInterval(loadingInterval);
            setTimeout(function() {
                $('#loader-wrapper').addClass('loaded');
                $('body').removeClass('loading');
                window.scrollTo(0, 0);
            }, 300);
        }
    }, 50);
    
    // Fallback: Force loading to complete after 5 seconds
    setTimeout(function() {
        if (!$('#loader-wrapper').hasClass('loaded')) {
            clearInterval(loadingInterval);
            $('#loading-percent').text('100%');
            $('#loader-wrapper').addClass('loaded');
            $('body').removeClass('loading');
            window.scrollTo(0, 0);
        }
    }, 5000);
    
    // Caches for geo json
    let provincesCache = null;
    let districtsCache = null;
    let subdistrictsCache = null;

    // Load provinces data
    loadProvinces();
    
    // Setup birthdate calculation
    $('#Insured_DOB').on('change', function() {
        const birthdate = $(this).val();
        if (birthdate) {
            const age = calculateAge(birthdate);
            $('#age').val(age);
        }
    });
    
    // Setup province change handler (Cust_Province -> Cust_Amphur)
    $('select[name="Cust_Province"]').on('change', async function() {
        const provinceName = $(this).val();
        const $districtSelect = $('select[name="Cust_Amphur"]');
        const $subdistrictSelect = $('select[name="Cust_District"]');
        const $zipInput = $('input[name="Cust_Zipcode"]');

        // reset child selects
        $districtSelect.prop('disabled', true).html('<option value="">เลือก</option>');
        $subdistrictSelect.prop('disabled', true).html('<option value="">เลือก</option>');
        $zipInput.val('');

        if (!provinceName) return;

        try {
            if (!provincesCache) {
                provincesCache = await $.getJSON('/assets/provinces.json');
            }
            if (!districtsCache) {
                districtsCache = await $.getJSON('/assets/districts.json');
            }
            const province = provincesCache.find(p => p.provinceNameTh === provinceName);
            if (!province) return;

            const filteredDistricts = districtsCache.filter(d => String(d.provinceCode) === String(province.provinceCode));
            filteredDistricts.forEach(d => {
                $districtSelect.append(`<option value="${d.districtNameTh}" data-code="${d.districtCode}">${d.districtNameTh}</option>`);
            });
            $districtSelect.prop('disabled', filteredDistricts.length === 0);
        } catch (err) {
            console.log('Failed to load districts:', err);
        }
    });

    // Setup district change handler (Cust_Amphur -> Cust_District)
    $('select[name="Cust_Amphur"]').on('change', async function() {
        const $districtSelect = $(this);
        const selectedDistrictCode = $districtSelect.find(':selected').data('code');
        const $subdistrictSelect = $('select[name="Cust_District"]');
        const $zipInput = $('input[name="Cust_Zipcode"]');

        $subdistrictSelect.prop('disabled', true).html('<option value="">เลือก</option>');
        $zipInput.val('');
        if (!selectedDistrictCode) return;

        try {
            if (!subdistrictsCache) {
                subdistrictsCache = await $.getJSON('/assets/subdistricts.json');
            }
            const filteredSubdistricts = subdistrictsCache.filter(s => String(s.districtCode) === String(selectedDistrictCode));
            filteredSubdistricts.forEach(s => {
                const postal = s.postalCode || '';
                $subdistrictSelect.append(`<option value="${s.subdistrictNameTh}" data-postal="${postal}">${s.subdistrictNameTh}</option>`);
            });
            $subdistrictSelect.prop('disabled', filteredSubdistricts.length === 0);
        } catch (err) {
            console.log('Failed to load subdistricts:', err);
        }
    });

    // Setup subdistrict change handler -> fill zipcode
    $('select[name="Cust_District"]').on('change', function() {
        const postal = $(this).find(':selected').data('postal') || '';
        $('input[name="Cust_Zipcode"]').val(postal);
    });
});

// Load provinces from JSON file
function loadProvinces() {
    $.getJSON('/assets/provinces.json', function(data) {
        const provinceSelect = $('select[name="Cust_Province"]');
        data.forEach(function(province) {
            provinceSelect.append(`<option value="${province.provinceNameTh}" data-code="${province.provinceCode}">${province.provinceNameTh}</option>`);
        });
    }).fail(function() {
        console.log('Failed to load provinces data');
        // Fallback provinces
        const provinces = [
            'กรุงเทพมหานคร', 'สมุทรปราการ', 'นนทบุรี', 'ปทุมธานี', 'พระนครศรีอยุธยา',
            'เชียงใหม่', 'เชียงราย', 'นครราชสีมา', 'ขอนแก่น', 'อุดรธานี'
        ];
        const provinceSelect = $('select[name="Cust_Province"]');
        provinces.forEach(function(province) {
            provinceSelect.append(`<option value="${province}">${province}</option>`);
        });
    });
}

// Calculate age from Thai birthdate format
function calculateAge(birthdate) {
    const parts = birthdate.split('/');
    if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const year = parseInt(parts[2]) - 543; // Convert from BE to CE
        
        const birth = new Date(year, month - 1, day);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }
    return '';
}

// Handle main-container with setTimeout
const mainContainer = document.querySelector('.main-container.fade-slide');
if (mainContainer) {
    const delay = parseInt(mainContainer.dataset.delay) || 0;
    setTimeout(() => {
        mainContainer.classList.add('visible');
    }, delay);
}

// Handle other elements with IntersectionObserver
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
            const delay = parseInt(entry.target.dataset.delay) || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-slide:not(.main-container)').forEach(el => {
    observer.observe(el);
});