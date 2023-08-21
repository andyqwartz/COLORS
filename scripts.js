const colorDisplay = document.getElementById('colorDisplay');
const colorInfo = document.getElementById('colorInfo');
const hexCodeBox = document.getElementById('hexCode');
const rgbCodeBox = document.getElementById('rgbCode');
const shadeIcon = document.getElementById('shadeIcon');
const returnIcon = document.getElementById('returnIcon');
const shadeOfShadeMode = document.getElementById('shadeOfShadeMode');
let isShadeOfShade = false;
let isColorLocked = false;
let lockedColor = "#FFFFFF";
let targetColor = "#FFFFFF";
let transitionInterval;

colorDisplay.addEventListener('mousemove', handleMouseMove);
colorDisplay.addEventListener('mousedown', handleMouseDown);
colorDisplay.addEventListener('mouseup', handleMouseUp);
colorDisplay.addEventListener('touchmove', handleTouchMove);
colorDisplay.addEventListener('touchstart', handleTouchStart);
colorDisplay.addEventListener('touchend', handleTouchEnd);

shadeIcon.addEventListener('click', toggleShadeOfShadeMode);
returnIcon.addEventListener('click', toggleShadeOfShadeMode);

function handleMouseMove(e) {
    if (!isShadeOfShade && isColorLocked) {
        return;
    }
    const x = e.clientX;
    const y = e.clientY;
    updateColorAndCodes(x, y);
}

function handleMouseDown(e) {
    if (!isColorLocked) {
        const x = e.clientX;
        const y = e.clientY;
        updateColorAndCodes(x, y);
        isColorLocked = true;
        shadeIcon.textContent = '🔒';
        returnIcon.textContent = '↺';
        returnIcon.classList.remove('hidden');
    } else {
        isColorLocked = false;
        shadeIcon.textContent = '💧';
        returnIcon.classList.add('hidden');
        hideColorInfo(false);
    }
}

function handleMouseUp() {
    if (isColorLocked) {
        shadeIcon.textContent = '🔒';
    } else {
        shadeIcon.textContent = '💧';
    }
}

function handleTouchMove(e) {
    if (!isShadeOfShade && isColorLocked) {
        return;
    }
    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    updateColorAndCodes(x, y);
}

function handleTouchStart(e) {
    e.preventDefault();
    if (!isColorLocked) {
        const touch = e.touches[0];
        const x = touch.clientX;
        const y = touch.clientY;
        updateColorAndCodes(x, y);
        isColorLocked = true;
        shadeIcon.textContent = '🔒';
        returnIcon.classList.remove('hidden');
        transitionInterval = setInterval(() => {
            updateColorAndCodes(x, y);
        }, 100);
    }
}

function handleTouchEnd() {
    clearInterval(transitionInterval);
}

function toggleShadeOfShadeMode() {
    isShadeOfShade = !isShadeOfShade;
    if (isShadeOfShade) {
        shadeOfShadeMode.classList.remove('hidden');
        updateShadeOfShadeModeColors();
        returnIcon.classList.remove('hidden');
    } else {
        shadeOfShadeMode.classList.add('hidden');
        returnIcon.classList.add('hidden');
    }
    hideColorInfo(isColorLocked && isShadeOfShade);
}

function updateColorAndCodes(x, y) {
    const rgb = getRGBFromPosition(x, y);
    updateBackgroundColor(rgb);
    updateColorInfo(rgb);
    lockedColor = rgb;
}

function getRGBFromPosition(x, y) {
    const hue = (x / window.innerWidth) * 360;
    const lightness = 1 - y / window.innerHeight;
    return `hsl(${hue}, 100%, ${lightness * 100}%)`;
}

function updateBackgroundColor(rgb) {
    colorDisplay.style.backgroundColor = rgb;
}

function updateColorInfo(rgb) {
    const hexCode = RGBToHex(rgb);
    const rgbValues = getRGBValues(rgb);
    const colorName = getColorName(hexCode);

    hexCodeBox.textContent = `${colorName} / ${hexCode}`;
    hexCodeBox.style.display = isColorLocked ? 'block' : 'none';

    rgbCodeBox.textContent = `(${rgbValues.join(', ')})`;
    rgbCodeBox.style.display = isColorLocked ? 'block' : 'none';

    hexCodeBox.setAttribute("data-clipboard-text", hexCode);
    rgbCodeBox.setAttribute("data-clipboard-text", `(${rgbValues.join(', ')})`);
}

function RGBToHex(rgb) {
    return rgb.replace(/^hsl\((\d+),\s*(\d+%?),\s*(\d+%?)\)$/, function(match, r, g, b) {
        return `#${RGBComponentToHex(parseInt(r))}${RGBComponentToHex(parseInt(g))}${RGBComponentToHex(parseInt(b))}`;
    });
}

function getRGBValues(rgb) {
    return rgb.match(/\d+/g).map(Number);
}

function RGBComponentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function getColorName(hexCode) {
    // Add your color name mapping logic here
    return "Color Name"; // Replace with actual color name
}

function hideColorInfo(hidden) {
    if (hidden && isColorLocked) {
        hexCodeBox.style.display = 'block';
        rgbCodeBox.style.display = 'block';
    } else {
        hexCodeBox.style.display = 'none';
        rgbCodeBox.style.display = 'none';
    }
}
