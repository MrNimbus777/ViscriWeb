const max = function(x1, x2){
    return x1 > x2 ? x1 : x2;
}
const min = function(x1, x2){
    return x1 < x2 ? x1 : x2;
}
const root = document.querySelector(":root").style;
let resizeList;
let activate;
let deActivate;
if (window.innerWidth <= 768) {
    resizeList = function (val) {
        return;
    };
    activate = function (element) {
        element.classList.add("active");
    };
    deActivate = function (element) {
        element.classList.remove("active");
    };
} else {
    resizeList = function (val) {
        if (attractions_section == null) return;
        const array = [];
        let counter = 0;
        attractions_section.querySelectorAll("div.attraction").forEach(d => {
            if (!d.classList.contains("active")) {
                array[counter] = d;
                counter++;
            } else {
                if (val) {
                    instant(d);
                    instant(d.querySelector("img.title"));
                    instant(d.querySelector("h2"));
                    instant(d.querySelector("p"));
                }
            }
        });
        div_width = attractions_section.getBoundingClientRect().width / (counter + 2);
        div_width = ((div_width > (window.innerWidth / 10)) ? window.innerWidth / 10 : div_width);
        root.setProperty("--div_width", div_width + "px");
        for (let i = 0; i < counter; i++) {
            d = array[i];
            if (val) {
                instant(d);
                instant(d.querySelector("img.title"));
                instant(d.querySelector("h2"));
            }
        }
    };
    activate = function (element) {
        animate(element,
            () => {
                element.style.transform = "";
                element.style.opacity = "";
            },
            () => {
                element.style.transform = "scale(0.5)";
                element.style.opacity = "0";
                setTimeout(() => {
                    animate(element,
                        () => {
                            element.style.transform = "scale(0.8)";
                            element.style.opacity = "0";
                            element.style.width = "112.5vw";
                            element.style.height = "125vh";
                            element.style.left = "-5vw";
                        },
                        () => {
                            element.style.transform = "";
                            element.style.opacity = "";
                            element.style.width = "";
                            element.style.height = "";
                            element.style.left = "";
                            element.classList.add("active");
                            instant(element.querySelector("img"));
                            document.querySelector("body").style.overflow = "hidden";
                        }, 500
                    );
                }, 500);
            }, 500
        )
    };
    deActivate = function (element) {
        animate(element,
            () => {
                
            },
            () => {
                element.style.transform = "scale(0.8)";
                element.style.opacity = "0";
                element.style.width = "112.5vw";
                element.style.height = "125vh";
                element.style.left = "-5vw";
                setTimeout(() => {
                    animate(element,
                        () => {
                            element.classList.remove("active");
                            instant(element.querySelector("img"));
                            document.querySelector("body").style.overflow = "";
                            element.style.transform = "scale(0.5)";
                            element.style.opacity = "0";
                            element.style.width = "";
                            element.style.height = "";
                            element.style.left = "";
                        },
                        () => {
                            element.style.transform = "";
                            element.style.opacity = "";
                        }, 500
                    );
                }, 500);
            }, 500
        )
    };
}
const csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

sendFetch = async function(method, headers, data, perform_response){
    try {
        headers = {
            ...headers,
            'X-CSRFToken': csrf_token,
            'Content-Type': 'application/json',
        };
        const response = await fetch('/api/data/', {
            'method': method,
            'headers': headers,
            'body': data ? JSON.stringify(data) : null,
        });

        if (response.ok) {
            const data = await response.json();
            perform_response(data);
        } else {
            alert('Error: ' + response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Submission failed.');
    }
}

const login_button = document.querySelector("div.login");
let login_menu_toggle = false;
if(login_button != null) {
    initLoginForm = function(div){
        div.innerHTML = '<form class="login-form"><input type="text" id="username" name="username" placeholder="Username" required><input type="password" id="password" name="password" placeholder="Password" required><a href="#" class="forgot-password">Forgot your password?</a><button>Log In</button><a href="#" class="signup">Or Sign Up</a></form>';
        const btn = div.querySelector(".signup");
        btn.addEventListener('click', () => {
            initSignUpForm(div);
        });
        const form = div.querySelector("form");
        form.addEventListener('submit', function (event) {
            event.preventDefault();
        });
        const form_btn = div.querySelector("form button");
        form_btn.addEventListener('click', () => {
            
        });
    }
    initSignUpForm = function(div){
        div.innerHTML = '<form class="signup-form"><input type="text" id="username" name="username" placeholder="Username" required><input type="password" id="password" name="password1" placeholder="Password" required><input type="password" id="password2" name="password" placeholder="Confirm Password" required><button>Sign up</button><a href="#" class="login">Or Log In</a></form>';
        const btn = div.querySelector(".login");
        btn.addEventListener('click', () => {
            initLoginForm(div);
        });
        const form = div.querySelector("form");
        form.addEventListener('submit', function (event) {
            event.preventDefault();
        });
        const form_btn = div.querySelector("form button");
        form_btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const username = form['username'].value;
            const password1 = form['password1'].value;
            const password2 = form['password2'].value;
            if(password1 === password2) {
                const credentials = btoa(`${username}:${password1}`);
                sendFetch('POST', {'Authorization' : `${credentials}`}, {}, (r) => {
                    console.log(r);
                });
            } else alert("Password does not match")
        });
    }
    login_button.addEventListener('click', () => {
        if(!login_menu_toggle){
            let container = document.createElement('div');
            container.id = 'login_menu_container';
            container.style.width = '100vw';
            container.style.height = window.innerHeight+"px";
            container.style.position = 'fixed';
            container.style.left = "0";
            container.style.top = "0";
            container.style.zIndex = "2000";
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'center';
            container.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            document.body.appendChild(container);
            document.body.style.overflow = "hidden";
            let login_menu = document.createElement("div");
            login_menu.id = "login_menu";
            login_menu.style.width = "calc(clamp(100px, 30vw, 500px))";
            login_menu.style.height = "auto";
            login_menu.style.backgroundColor = "var(--color_mediumBg)";
            login_menu.style.borderRadius = "3vw";
            initLoginForm(login_menu);
            container.appendChild(login_menu);
            setTimeout(() => login_menu_toggle = true, 1);
            login_menu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
            container.addEventListener('click', () => {
                if(login_menu_toggle) {
                    login_menu_toggle = false;
                    container.remove();
                    container = null;
                    login_menu = null;
                    document.body.style.overflow = "";
                }
            });
        }
    });
}


//mobile menu
const mobile_menu_btn = document.querySelector("img#mobile-menu-btn");
const mobile_menu = document.querySelector("div#mobile-menu");
const mobile_menu_content = document.querySelector("div#mobile-menu-content");

let enabled = false;

mobile_menu_btn.addEventListener('click', () => {
    enabled = !enabled;

    if (enabled) {
        mobile_menu.style.visibility = "visible";
        mobile_menu_content.classList.remove("off");
        mobile_menu_content.classList.add("on");
        document.querySelector("body").style.overflow = "hidden";
    } else {
        mobile_menu.style.visibility = "hidden";
        mobile_menu_content.classList.remove("on");
        mobile_menu_content.classList.add("off");
        document.querySelector("body").style.overflow = "";
    }
});


// 
function isTopOnScreen(element) {
    return (element.getBoundingClientRect().top < window.innerHeight);
}
let con = 0
document.querySelectorAll(".apear-animation").forEach(e => {
    con++;
    if (isTopOnScreen(e)) {
        if (e.classList.contains("apear-animation")) {
            animate(e,
                () => { },
                () => {
                    e.classList.remove("apear-animation");
                }, 500
            );
        }
    } else {
        if (!e.classList.contains("apear-animation")) {
            animate(e,
                () => { },
                () => {
                    e.classList.add("apear-animation");
                }, 500
            );
        }
    }
    window.addEventListener("scroll", () => {
        if (isTopOnScreen(e)) {
            if (e.classList.contains("apear-animation")) {
                animate(e,
                    () => { },
                    () => {
                        e.classList.remove("apear-animation");
                    }, 500
                );
            }
        } else {
            if (!e.classList.contains("apear-animation")) {
                animate(e,
                    () => { },
                    () => {
                        e.classList.add("apear-animation");
                    }, 500
                );
            }
        }
    });
});
window.addEventListener('resize', () => {
    resizeAboutus(true);
    resizeService();
    resizeList(true);
    resizeMain();
});

window.addEventListener('load', () => {
    const sections = document.querySelectorAll("article.aboutus > section");
    sections.forEach(section => {
        section.querySelectorAll("img").forEach(e => {
            e.classList.add("clickable-item");
            setTimeout(() => {
                e.classList.remove("clickable-item");
            }, 3000);
        });
    });
});
function resizeMain() {
    const array = document.querySelectorAll("article.main-events > section > div.event-item");
    for (let i = 0; i < array.length; i++) {
        const e = array[i];
        e.style.height = -(-window.getComputedStyle(e).width.replace("px", "")) * 1.6 + "px";
    }
}
{
    resizeMain();
    const r = 82;
    const g = 0;
    const b = 0;
    const array = document.querySelectorAll("article.main-events > section > div.event-item");
    for (let i = 0; i < array.length; i++) {
        const e = array[i];
        const raport = i / array.length;
        e.style.backgroundColor = "rgba(" + r * raport + ", " + g * raport + ", " + b * raport + ", 0.5)";
        e.querySelector("img").style.backgroundColor = "rgba(" + r * raport + ", " + g * raport + ", " + b * raport + ", 1)";
    }
}

function animate(element, to, mili) {
    element.style.transition = "none";
    setTimeout(() => {
        element.style.transition = mili + 'ms ease';
        to();
    }, 1);
    setTimeout(() => {
        element.style.transition = '';
    }, mili)
}
function animate(element, from, to, mili) {
    element.style.transition = "none";
    from();
    setTimeout(() => {
        element.style.transition = mili + 'ms ease';
        to();
    }, 1);
    setTimeout(() => {
        element.style.transition = '';
    }, mili)
}

function instant(element) {
    element.style.transition = "none";
    setTimeout(() => {
        element.style.transition = "";
    }, 1);
}

// image arangement in a About Us
resizeAboutus(true);
function resizeAboutus(val) {
    const sections = document.querySelectorAll("article.aboutus > section");
    for (let i = 0; i < sections.length; i++) {
        const images = sections[i].querySelectorAll("img");
        const div_hover = sections[i].querySelector("div.hover");
        if (div_hover.classList.contains("off")) {
            const width = (sections[i].clientWidth / images.length);
            sections[i].style.padding = "0px";
            images.forEach(e => {
                e.style.width = width + "px";
                e.style.height = "100%";
                if (val) instant(e);
            });
            div_hover.style.width = sections[i].clientWidth + 0 + "px";
            div_hover.style.height = sections[i].clientHeight + 0 + "px";
        } else {
            sections[i].style.padding = "";
            const width = ((sections[i].clientWidth - 40) / images.length);
            images.forEach(e => {
                e.style.width = width + "px";
                e.style.height = "";
                if (val) instant(e);
            });
            div_hover.style.width = sections[i].clientWidth - 39 + "px";
            div_hover.style.height = sections[i].clientHeight - 39 + "px";
        }
        if (val) {
            instant(div_hover);
            instant(sections[i]);
        }
    }
}

let sections = document.querySelectorAll("article.aboutus > section");
for (let i = 0; i < sections.length; i++) {
    const div_hover = sections[i].querySelector("div.hover");
    sections[i].addEventListener('click', () => {
        if (div_hover.classList.contains("off")) {
            div_hover.classList.remove("off");
            sections[i].style.padding = "";
            const images = sections[i].querySelectorAll("img");
            const width = ((sections[i].clientWidth - 40) / images.length);
            images.forEach(e => {
                e.style.width = width + "px";
                e.style.height = "";
            });
            div_hover.style.width = sections[i].clientWidth - 39 + "px";
            div_hover.style.height = sections[i].clientHeight - 39 + "px";
        } else {
            div_hover.classList.add("off");
            const images = sections[i].querySelectorAll("img");
            const width = (sections[i].clientWidth / images.length);
            sections[i].style.padding = "0px";
            images.forEach(e => {
                e.style.width = width + "px";
                e.style.height = "100%";
            });
            div_hover.style.width = sections[i].clientWidth + 0 + "px";
            div_hover.style.height = sections[i].clientHeight + 0 + "px";
        }
    });
}

// image arangement in a Services
resizeService();
function resizeService() {
    const sections = document.querySelectorAll("article.services section");
    for (let i = 0; i < sections.length; i++) {
        const image = sections[i].querySelector("img");

        image.style.width = sections[i].clientWidth * 0.7 + "px";
        image.style.height = sections[i].clientHeight + "px";
        image.style.left = sections[i].clientLeft + sections[i].clientWidth - 2 - image.clientWidth + "px";

        const overlay = sections[i].querySelector("div.overlay");
        const text = sections[i].querySelector("p");

        overlay.style.width = sections[i].clientWidth + "px";
        overlay.style.height = sections[i].clientHeight + "px";
        overlay.style.background = 'linear-gradient(90deg, var(--color_mediumBg2) ' + (text.clientWidth * 0.85) + 'px , rgba(255, 255, 255, 0) ' + (text.clientWidth * 1.55) + 'px)'
    }
}


//image arangement Attractions
const attractions_section = document.querySelector("article.attractions > section");
let div_width = 0;
if (attractions_section != null) attractions_section.querySelectorAll("div.attraction").forEach(d => {
    const img = d.querySelector("img.title");

    img.addEventListener('click', () => {
        if (!d.classList.contains("active")) {
            const array = attractions_section.querySelectorAll("div.attraction");
            for (let i = 0; i < array.length; i++) {
                const e = array[i];
                if (e.classList.contains("active")) {
                    deActivate(e);
                }
            }
            activate(d);
        } else {
            deActivate(d);
        }
    });
});


function getActive(array) {
    let element = null;
    array.forEach(e => {
        if (e.classList.contains("active")) element = e;
    });
    return element;
}

resizeList(true);

function getLeft(element) {
    return -(-element.style.left.replace('px', '')) || element.getBoundingClientRect().left;
}
function getWidth(element) {
    return -(-element.style.width.replace('px', '')) || element.getBoundingClientRect().width;
}
function centerElementsAbsolute(parent, elements) {
    let width = 0;
    elements.forEach(e => width += getWidth(e));
    const space = getWidth(parent);
    const start = getLeft(parent) + space / 2 + width / 2;
    let passed = 0;
    for (let i = 0; i < elements.length; i++) {
        const e = elements[i];
        passed += getWidth(e);
        e.style.left = start - passed + 'px';
    }
}
function centerElementsRelative(parent, elements) {
    let width = 0;
    elements.forEach(e => width += getWidth(e));
    const space = getWidth(parent);
    const start = space / 2 + width / 2;
    let passed = 0;
    for (let i = 0; i < elements.length; i++) {
        const e = elements[i];
        passed += getWidth(e);
        e.style.left = start - passed + 'px';
    }
}

const form = document.getElementById('contact-form');
const response = document.getElementById('response');

if (form) form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (name && email && message) {
        response.textContent = 'Thank you for your message! We will get back to you soon.';
        response.style.display = "flex";
        setTimeout(() => {
            response.style.display = "none";
        }, 5000);
        form.reset();
    } else {
        response.textContent = 'Please fill in all fields.';
        response.style.display = "flex";
        setTimeout(() => {
            response.style.display = "none";
        }, 5000);
    }
});


// manage Events
const pages = Math.trunc((document.querySelectorAll("article.events>section div.event").length-1)/4) + 1;
const length = document.querySelectorAll("article.events>section div.event").length;
function getPage(page){
    const array = [];
    for(let i = 0; (i < 4) && (i+pages*page < length); i++) {
        array[i] = document.querySelectorAll("article.events>section div.event")[i+pages*page];
    }
    return array;
}
function turnPage(page) {
    for(let i = 0; i < pages; i++) {
        if(i == page) getPage(i).forEach(e => e.classList.remove("off"))
        else getPage(i).forEach(e => e.classList.add("off"))
    }
    try{
        document.querySelector("article.events div.page-slider div.page-nr").innerHTML = page+1;
    } catch (excepion) {
        
    }
}
let page_now = 0;
turnPage(page_now);
document.querySelectorAll("article.events div.page-slider button.next").forEach(e => {
    e.addEventListener('click', () => {
        page_now++;
        page_now = ((page_now+pages)%pages);
        turnPage(page_now);
        window.scrollTo(window.top);
    });
});
document.querySelectorAll("article.events div.page-slider button.prev").forEach(e => {
    e.addEventListener('click', () => {
        page_now--;
        page_now = ((page_now+pages)%pages);
        turnPage(page_now);
        window.scrollTo(window.top);
    });
});