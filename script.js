let duckposition = ["img/duck-left.gif", "img/duck-right.gif"];
let duckWidth = 100;
let duckHeight = 97;
let ducks = [];
let score = 0;
let gameWidth = window.innerWidth;
let gameHeight = window.innerHeight;
let duckVelocityX = 3;
let duckVelocityY = 2;
let oneduckor2;
let Round = 1;
let bullet = 3;
let hoveredDuck;
let isPaused = false;
let isOver = false
let pause = document.getElementById('pause');
pause.addEventListener('click', () => {
    if (!isOver) {
        isPaused = !isPaused;
        pause.innerText = isPaused ? "Continue" : "Pause";

    }
});
window.addEventListener("pointerdown", (event) => {
    shoot(event.clientX, event.clientY);
});

window.addEventListener("keydown", (event) => {
    if (event.code === "KeyP" && !isOver) {
        isPaused = !isPaused;
        pause.innerText = isPaused ? "Continue" : "Pause";
    }
    if (isPaused) return;

    if (event.code === "Space") {
        if (bullet !== 0) {
            new Audio("audio/duck-shot.mp3").play();
            let divcontainer = document.getElementById('bull');
            if (divcontainer.firstChild) {
                divcontainer.removeChild(divcontainer.firstChild);
                bullet--;
            }
            if (hoveredDuck) {
                score++;
                document.getElementById("score").innerText = score * 100 + " score";
                hoveredDuck.img.src = 'img/1.png';
                let fallingdownAnimation = hoveredDuck;
                requestAnimationFrame(() => fallDown(fallingdownAnimation));
                ducks = ducks.filter(d => d !== hoveredDuck);
                hoveredDuck = null;
                if (ducks.length === 0) setTimeout(adddog, 1500);
            }
        } else if (bullet <= 0) {
            console.log('No bullets left!');
            if (!isOver && ducks.length) gameover()
            return

        }
    }
});
window.addEventListener("resize", () => {
    gameWidth = window.innerWidth;
    gameHeight = window.innerHeight;
});

function shoot(x, y) {

    if (isPaused) return;

    if (bullet <= 0) {
        gameover();
        return;
    }
    new Audio("duck-shot.mp3").play();
    if (navigator.vibrate) {
        navigator.vibrate(100);
    }
    let divcontainer = document.getElementById('bull');
    if (divcontainer.firstChild) {
        divcontainer.removeChild(divcontainer.firstChild);
        bullet--;
    }
    for (let duck of ducks) {
        let rect = duck.img.getBoundingClientRect();
        if (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
        ) {
            score++;
            document.getElementById("score").innerText =
                score * 100 + " score";
            duck.img.src = '1.png';
            requestAnimationFrame(() => fallDown(duck));
            ducks = ducks.filter(d => d !== duck);
            if (ducks.length === 0)
                setTimeout(adddog, 1500);
            break;
        }
    }
}

function randomPosition(max) {
    return Math.floor(Math.random() * max);
}

function addbullet() {
    let oldDiv = document.getElementById('bull');
    if (oldDiv) oldDiv.remove();
    let div = document.createElement('div');
    div.id = 'bull';
    document.body.appendChild(div);
    for (let i = 0; i < 3; i++) {
        let bulletimg = document.createElement('img');
        bulletimg.src = 'img/0.png';
        bulletimg.classList.add('bullet');
        div.appendChild(bulletimg);
    }
    bullet = 3;
}

window.onload = function () {
    addbullet();
    setTimeout(addDucks, 100);
    requestAnimationFrame(gameLoop);
};

function addDucks() {
    ducks = [];
    oneduckor2 = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < oneduckor2; i++) {
        let img = document.createElement("img");
        let random = Math.floor(Math.random() * 2)
        img.src = duckposition[random];
        img.width = duckWidth;
        img.height = duckHeight;
        img.style.position = "absolute";
        img.draggable = false;
        let duck = {
            img: img,
            x: randomPosition(gameWidth - duckWidth),
            y: randomPosition(gameHeight - duckHeight),
            velocityX: random === 0 ? -duckVelocityX : duckVelocityX,
            velocityY: -duckVelocityY
        };
        updateDuckPosition(duck);
        img.addEventListener("mouseover", () => hoveredDuck = duck);
        img.addEventListener("mouseout", () => { if (hoveredDuck === duck) hoveredDuck = null; });
        document.body.appendChild(img);
        ducks.push(duck);
    }
}

function updateDuckPosition(duck) {
    duck.img.style.transform = `translate(${duck.x}px, ${duck.y}px)`;
}

function fallDown(obj) {
    if (isPaused) {
        requestAnimationFrame(() => fallDown(obj));
        return;
    }
    obj.y += 9;
    updateDuckPosition(obj);
    obj.img.src = obj.velocityX > 0 ? "img/fallright.png" : "img/fallleft.png";
    if (obj.y + duckHeight > gameHeight) {
        obj.img.remove();
        return;
    }
    requestAnimationFrame(() => fallDown(obj));
}

function moveduck() {
    if (isPaused) return;
    for (let duck of ducks) {
        duck.x += duck.velocityX;
        duck.y += duck.velocityY;
        if (duck.x < 0 || duck.x + duckWidth > gameWidth) {
            duck.velocityX *= -1;
            duck.img.src = duck.velocityX < 0 ? duckposition[0] : duckposition[1];
        }
        if (duck.y < 0 || duck.y + duckHeight > gameHeight) {
            duck.velocityY *= -1;
        }
        duck.x = Math.max(0, Math.min(duck.x, gameWidth - duckWidth));
        duck.y = Math.max(0, Math.min(duck.y, gameHeight - duckHeight));

        updateDuckPosition(duck);
    }
}

function adddog() {
    let dog = document.createElement('img');
    dog.src = oneduckor2 === 1 ? 'img/dog-duck1.png' : 'img/dog-duck2.png';
    dog.classList.add("dog");
    document.body.appendChild(dog);
    setTimeout(() => {
        dog.remove();
        Round++;
        duckVelocityX++;
        duckVelocityY++;
        document.getElementById('round').innerText = "R" + Round;
        addbullet();
        addDucks();
    }, 2000);
}

function gameLoop() {
    if (!isPaused || isOver) update();
    requestAnimationFrame(gameLoop);
}

function update() {
    moveduck();
}

function gameover() {
    isPaused = true;
    isOver = true
    let over = document.createElement("div");
    over.id = "gameover";
    over.innerHTML = `
    <div class="gameover-box">
            <h1>GAME OVER</h1>
            <p>Score: ${score * 100}</p>
            <button id="restart-btn">Restart</button>
        </div>

    `
    document.body.appendChild(over);




    document.getElementById("restart-btn")
        .addEventListener("click", () => {
            console.log('hi');

            location.reload();
        });
}

// khasni nzid dik blan dyal batat

// w ndir time w imta kaykhsr l3ab


//khasni n9ad chwiya style

//nzid music

// ndir Animation dyal lkalb + ndidr lbata lhamra (ikhtiyari)

// ilyas: *khas n9ad gameover
//        *ou n9ad stayl ou responsibl nta3 telefoun    