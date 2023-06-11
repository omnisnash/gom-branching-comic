const imageWidth = 874;
const imageHeight = 1240;

const story = {
    start: {
        path: [
            {id: 2, x: 105, y: 1050, radius: 100, direction: "sw"},
            {id: 3, x: 651, y: 1160, radius: 55, direction: "s"},
            {id: 4, x: 787, y: 1095, radius: 90, direction: "se"},
        ]
    },
    2: {
        path: [
            {id: 5, x: 126, y: 1105, radius: 90, direction: "s"},
            {id: 6, x: 578, y: 760, radius: 100, direction: "e"},
        ]
    },
    3: {
        path: [
            {id: 5, x: 175, y: 1035, radius: 90, direction: "sw"},
            {id: 7, x: 565, y: 1045, radius: 100, direction: "s"},
        ]
    },
    4: {
        path: [
            {id: 7, x: 545, y: 1097, radius: 115, direction: "s"},
        ]
    },
    5: {
        path: [
            {id: 10, x: 725, y: 1160, radius: 80, direction: "se"},
        ]
    },
    6: {
        path: [
            {id: 7, x: 575, y: 1130, radius: 100, direction: "s"},
            {id: 9, x: 250, y: 1100, radius: 60, direction: "s", isHidden: true},
        ]
    },
    7: {
        path: [
            {id: 8, x: 130, y: 1110, radius: 110, direction: "w"},
        ]
    },
    8: {
        path: [
            {id: 10, x: 565, y: 1160, radius: 75, direction: "e"},
        ]
    },
    9: {
        path: [
            {id: "start", x: 190, y: 700, radius: 100, direction: "s"},
            {id: 11, x: 840, y: 430, radius: 30, direction: "e"},
        ]
    },
    10: {
        path: [
            {id: 12, x: 590, y: 1200, radius: 40, direction: "s"},
        ]
    },
    11: {
        isEnd: true,
        path: [
            {x: 290, y: 400, radius: 220, direction: "none"},
        ]
    },
    12: {
        isEnd: true,
        path: [
            {x: 325, y: 340, radius: 240, direction: "none"},
        ]
    }
}

let animationDuration = 500;
let currentPage = "start";

window.addEventListener("load", () => {
    draw().catch((error) => console.error(error));
});

window.addEventListener("resize", () => {
    draw().catch((error) => console.error(error));
});

function clearInteractions() {
    for (let div of document.getElementsByClassName("interaction")) {
        div.remove();
    }
}

async function draw(animation) {
    clearInteractions();

    await animateAndUpdateImage(animation);

    placeInteractions();
}

async function animateAndUpdateImage(animation) {
    return new Promise((resolve) => {
        const image = document.getElementById('image-view');

        if (animation) {
            image.style.animation = `${animation}-enter ${animationDuration}ms, fadeOut ${animationDuration}ms`
            image.src = `img/pages/${currentPage}.jpg`
            setTimeout(() => {
                image.style.animation = undefined;
                resolve();
            }, animationDuration)

        } else {
            image.src = `img/pages/${currentPage}.jpg`
            resolve();
        }
    })
}

function placeInteractions() {
    const main = document.getElementById('main-view');
    const image = document.getElementById('image-view');

    const imageBounds = image.getBoundingClientRect();
    const widthRatio = imageBounds.width / imageWidth;
    const heightRatio = imageBounds.height / imageHeight;

    for (let path of story[currentPage].path) {
        const pointX = path.x * widthRatio;
        const pointY = path.y * heightRatio;
        const radius = path.radius * widthRatio;

        const backgroundPath = story[currentPage].isEnd ? `${currentPage}-end` : path.id;

        const div = document.createElement("div");
        div.style.position = 'absolute';
        div.style.width = `${radius * 2}px`;
        div.style.height = `${radius * 2}px`;
        div.style.left = `${pointX - radius + imageBounds.x}px`
        div.style.top = `${pointY - radius + imageBounds.y}px`
        div.style.backgroundImage = `url(img/memes/meme-${backgroundPath}.jpg)`;
        div.classList.add("interaction");
        if (path.isHidden) {
            div.classList.add("hidden");
        }
        div.addEventListener('click', () => {
            clearInteractions();
            currentPage = story[currentPage].isEnd ? "start" : path.id;

            image.style.animation = `${path.direction}-exit ${animationDuration}ms, fadeOut ${animationDuration}ms`
            setTimeout(() => {
                image.style.animation = undefined;
                draw(path.direction).catch((error) => console.error(error));
                // -100 avoid image clipping
            }, animationDuration - 100)
        })

        main.appendChild(div)
    }
}