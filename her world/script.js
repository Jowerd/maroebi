/* =========================================================
   7 PHOTO GIRLY GALLERY 🎀
========================================================= */


/* =========================================================
   აქ მხოლოდ ფოტოები უნდა მიუთითო
========================================================= */

const photos = [

    "photos/01.jpg",
    "photos/02.jpg",
    "photos/03.jpg",
    "photos/04.jpg",
    "photos/05.jpg",
    "photos/06.jpg",
    "photos/07.jpg"

];


/* =========================================================
   თითო ფოტოს პატარა ტექსტი
========================================================= */

const captions = [

    "აი ახლა მითხარი რომ ფოტოგენური არ ხარ ♡",

    "კარგი, პირველი საკმარისი იყო...",

    "მაგრამ ესეც შემთხვევითია ალბათ ხომ?🎀",

    "კიდევ ერთი „არ ვარ ფოტოგენური“",

    "ჰოო, რა თქმა უნდა...",

    "უკვე აღარ გიჯერებთ მაროები♡",

    "საქმე საბოლოოდ დამტკიცებულია (და ეს ფოტო ყველაზე ქულ არის)🎀"

];


/* =========================================================
   ELEMENTS
========================================================= */

const gallery =
    document.querySelector(".gallery");

const cardsContainer =
    document.getElementById("cards");

const counter =
    document.getElementById("counter");

const caption =
    document.getElementById("caption");

const progress =
    document.querySelector(".progress-fill");

const ending =
    document.querySelector(".ending");


/* =========================================================
   CREATE PHOTO CARDS
========================================================= */

const cards = [];


photos.forEach(
    (photo, index) => {

        const card =
            document.createElement("div");

        card.className =
            "card";


        card.innerHTML = `

            <div class="card-inner">

                <img
                    src="${photo}"
                    alt=""
                    draggable="false"
                >

            </div>

        `;


        cardsContainer.appendChild(card);


        cards.push(card);

    }
);


/* =========================================================
   SCROLL VARIABLES
========================================================= */

let targetScroll =
    window.scrollY;

let currentScroll =
    window.scrollY;


window.addEventListener(
    "scroll",
    () => {

        targetScroll =
            window.scrollY;

    },
    {
        passive: true
    }
);


/* =========================================================
   HELPERS
========================================================= */

function clamp(
    value,
    min,
    max
) {

    return Math.max(
        min,
        Math.min(
            max,
            value
        )
    );

}


function lerp(
    a,
    b,
    amount
) {

    return (
        a +
        (b - a) *
        amount
    );

}


function easeOut(
    t
) {

    return 1 -
        Math.pow(
            1 - t,
            3
        );

}


function easeInOut(
    t
) {

    return t < .5

        ? 2 * t * t

        : 1 -
          Math.pow(
              -2 * t + 2,
              2
          ) / 2;

}


/* =========================================================
   ANIMATION LOOP
========================================================= */

function animationLoop() {


    currentScroll =
        lerp(
            currentScroll,
            targetScroll,
            .075
        );


    updateGallery();

    updateProgress();


    requestAnimationFrame(
        animationLoop
    );

}


requestAnimationFrame(
    animationLoop
);


/* =========================================================
   GALLERY
========================================================= */

function updateGallery() {


    const top =
        gallery.offsetTop;


    const height =
        gallery.offsetHeight;


    const viewport =
        window.innerHeight;


    const scrollInside =
        currentScroll -
        top;


    const available =
        height -
        viewport;


    let progress =
        scrollInside /
        available;


    progress =
        clamp(
            progress,
            0,
            1
        );


    updateCards(
        progress
    );

}


/* =========================================================
   PHOTO MOVEMENT
========================================================= */

function updateCards(
    progress
) {


    const total =
        cards.length;


    if (!total) return;


    /*
       7 ფოტოს ვანაწილებთ
       მთელ scroll-ზე.
    */

    const section =
        1 / total;


    let active =
        0;

    let bestDistance =
        Infinity;


    cards.forEach(
        (card, index) => {


            /*
               თითო ფოტოს თავისი
               პატარა timeline აქვს.
            */

            const center =
                index *
                section;


            const range =
                section *
                1.65;


            let local =
                (
                    progress -
                    center +
                    range / 2
                ) /
                range;


            /*
               საერთოდ შორსაა.
            */

            if (
                local < 0 ||
                local > 1
            ) {

                card.style.opacity =
                    "0";

                return;

            }


            local =
                clamp(
                    local,
                    0,
                    1
                );


            /*
               თითოეული ფოტო
               მონაცვლეობით შედის:

               1,3,5,7 ← მარცხნიდან

               2,4,6   → მარჯვნიდან
            */

            const direction =
                index % 2 === 0
                    ? -1
                    : 1;


            /*
               ==================================
               ENTER
               ==================================
            */

            let x;


            if (local < .5) {

                const enter =
                    local * 2;


                const eased =
                    easeOut(
                        enter
                    );


                x =
                    direction *
                    (
                        440 -
                        eased * 440
                    );

            }


            /*
               ==================================
               CENTER → EXIT
               ==================================
            */

            else {

                const exit =
                    (
                        local -
                        .5
                    ) * 2;


                const eased =
                    easeInOut(
                        exit
                    );


                x =
                    direction *
                    (
                        eased * 440
                    );

            }


            /*
               ოდნავ ზემოთ/ქვემოთ
               მოძრაობა.
            */

            const y =
                Math.sin(
                    local *
                    Math.PI
                ) *
                -22;


            /*
               დახრილობა.

               ცენტრში = 0deg
            */

            const rotation =
                direction *
                (
                    7 *
                    Math.abs(
                        local - .5
                    ) *
                    2
                );


            /*
               ძალიან მსუბუქი 3D.
            */

            const rotateY =
                direction *
                (
                    7 *
                    Math.abs(
                        local - .5
                    ) *
                    2
                );


            /*
               ზომა.

               არავითარი გიჟური zoom.
            */

            const scale =
                .90 +
                (
                    Math.sin(
                        local *
                        Math.PI
                    ) *
                    .10
                );


            /*
               Fade.
            */

            let opacity;


            if (local < .12) {

                opacity =
                    local / .12;

            }

            else if (local > .88) {

                opacity =
                    (1 - local) / .12;

            }

            else {

                opacity = 1;

            }


            opacity =
                clamp(
                    opacity,
                    0,
                    1
                );


            /*
               აქტიური ფოტოს პოვნა.
            */

            const distance =
                Math.abs(
                    local - .5
                );


            if (
                distance <
                bestDistance
            ) {

                bestDistance =
                    distance;

                active =
                    index;

            }


            /*
               Z-index.
            */

            const zIndex =
                100 -
                Math.round(
                    distance * 100
                );


            /*
               მთავარი მოძრაობა.
            */

            card.style.transform = `

                translate3d(

                    calc(
                        -50% +
                        ${x}px
                    ),

                    calc(
                        -50% +
                        ${y}px
                    ),

                    0

                )

                rotateZ(
                    ${rotation}deg
                )

                rotateY(
                    ${rotateY}deg
                )

                scale(
                    ${scale}
                )

            `;


            card.style.opacity =
                opacity;


            card.style.zIndex =
                zIndex;

        }
    );


    /*
       Counter.
    */

    counter.textContent =
        `${active + 1} / ${total}`;


    /*
       Caption.
    */

    if (
        captions[active]
    ) {

        caption.textContent =
            captions[active];

    }

}


/* =========================================================
   PAGE PROGRESS
========================================================= */

function updateProgress() {


    const max =
        document.documentElement
            .scrollHeight -
        window.innerHeight;


    if (max <= 0) return;


    const value =
        currentScroll /
        max;


    progress.style.height =
        `${value * 100}%`;

}


/* =========================================================
   ENDING ANIMATION
========================================================= */

const observer =
    new IntersectionObserver(

        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        ending.classList.add(
                            "visible"
                        );

                    }

                }
            );

        },

        {
            threshold: .25
        }

    );


observer.observe(
    ending
);


/* =========================================================
   PRELOAD
========================================================= */

photos.forEach(
    source => {

        const img =
            new Image();

        img.decoding =
            "async";

        img.src =
            source;

    }
);