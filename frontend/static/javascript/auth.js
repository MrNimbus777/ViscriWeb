const csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

const makeSecure = document.location.protocol === 'https:' ? 'SameSite=None; Secure' : 'SameSite=Strict'

async function sendFetch(method, destination, headers, data, perform_response){
    try {
        headers = {
            ...headers,
            'X-CSRFToken': csrf_token,
            'Content-Type': 'application/json',
        };
        const response = await fetch(`/api/${destination}/`, {
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

async function getUserData(token, options, perform_response){
    sendFetch('POST', 'get_user_data', {'token': token}, {'options': options}, perform_response);
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const user_button = document.querySelector("div.user");
let login_menu_toggle = false;
session_token = getCookie("session_token");
if(user_button != null) {
    function notLoggedInPage() {
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
                const username = form['username'].value;
                const password = form['password'].value;
                const credentials = btoa(`${username}:${password}`);
                sendFetch('POST', "login", {'Authorization' : `${credentials}`}, {}, (r) => {
                    let status = r["status"];
                    switch(status) {
                        case "success" : {
                            document.cookie = `session_token=${r["session_token"]}; path=/; max-age=2678400; ${makeSecure}`;
                            location.reload(false);
                            break;
                        }
                        case "not_existing" : {
                            if(div.querySelector('form h3') == null){
                                let a = document.createElement('h3');
                                a.textContent = "This user does not exist"
                                div.querySelector('form').insertBefore(a, document.getElementById('username'));
                                setTimeout(() => a.remove(), 5000);
                            }
                            break;
                        }
                        case "wrong_password" : {
                            let inp = document.getElementById('password');
                            inp.value = '';
                            inp.placeholder = 'Wrong password';
                            setTimeout(() => {
                                inp.placeholder = 'Password';
                            }, 5000);
                            break;
                        }
                        default : {
                            alert("Uknown response");
                            break;
                        }
                    }
                });
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
                    sendFetch('POST', "signup", {'Authorization' : `${credentials}`}, {}, (r) => {
                        let status = r["status"];
                        switch(status) {
                            case "success" : {
                                document.cookie = `session_token=${r["session_token"]}; path=/; max-age=2678400; SameSite=None; Secure`;
                                location.reload(false);
                                break;
                            }
                            case "existing" : {
                                if(div.querySelector('form h3') == null){
                                    let a = document.createElement('h3');
                                    a.textContent = "This user already exists"
                                    div.querySelector('form').insertBefore(a, document.getElementById('username'));
                                    setTimeout(() => a.remove(), 5000);
                                }
                                break;
                            }
                            default : {
                                alert("Uknown response");
                                break;
                            }
                        }
                    });
                } else {
                    if(div.querySelector('form h3') == null){
                        let a = document.createElement('h3');
                        a.textContent = "Passwords does not match."
                        div.querySelector('form').insertBefore(a, document.getElementById('password'));
                        document.getElementById('password').value = '';
                        document.getElementById('password2').value = '';
                        setTimeout(() => a.remove(), 5000);
                    }
                }
            });
        }
        user_button.addEventListener('click', () => {
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
    function loggedInPage(token){
        let user_menu = document.createElement('div');
        user_menu.id = 'user_menu';
        user_button.addEventListener('click', () => { 
            user_menu.classList.toggle('hidden');
        });

        user_menu.classList.add('hidden');
        document.body.appendChild(user_menu);
        
        let container_userMain = document.createElement('div');
        user_menu.appendChild(container_userMain);

        let container_userBio = document.createElement('div');
        user_menu.appendChild(container_userBio);
        
        
        let avatar = document.createElement('div');
        avatar.classList.add('avatar');
        container_userMain.appendChild(avatar);

        
        let container_userMain_short = document.createElement('div');
        container_userMain.appendChild(container_userMain_short);
        
        let username = document.createElement('h3');
        container_userMain_short.appendChild(username);
        
        let likes = document.createElement('div');
        container_userMain_short.appendChild(likes);

        let dislikes = document.createElement('div');
        container_userMain_short.appendChild(dislikes);

        
        let bioLabel = document.createElement('label');
        bioLabel.textContent = 'Biography:';
        container_userBio.appendChild(bioLabel);
        let bio = document.createElement('p');
        container_userBio.appendChild(bio);

        getUserData(
            token,
            ['username', 'bio', 'image', 'likes', 'dislikes'],
            (r) => {
                if(r['status'] === 'success') {
                    if(r['image'] !== 'none'){
                        const base64Avatar = r['image'];
                        const imageFormat = r['format'] || "png";
                        avatar.style.backgroundImage = `url('data:image/${imageFormat};base64,${base64Avatar}')`;
                        user_button.style.backgroundImage = `url('data:image/${imageFormat};base64,${base64Avatar}')`;
                    } else {
                        avatar.style.backgroundImage = 'url("../static/images/login_avatar.png")';
                    }
                    username.textContent = r.username;
                    bio.textContent = r.bio;
                    likes.innerHTML = `<img src="../static/images/likes.jpg"><label>${r['likes']}</label>`
                    dislikes.innerHTML = `<img src="../static/images/likes.jpg"><label>${r['dislikes']}</label>`
                } else location.reload(false);
            }
        );
        


    }
    if(session_token) {
        sendFetch('POST', "check_token", {'token' : `${session_token}`}, {}, (r) => {
            let status = r['status'];
            if(status === 'valid'){
                loggedInPage(session_token);
                document.cookie = `session_token=${session_token}; path=/; max-age=2678400;  ${makeSecure}`;
            } else {
                notLoggedInPage();
                document.cookie = `session_token=; path=/; max-age=;  ${makeSecure}`;
            }
        });
    } else {
        notLoggedInPage();
        document.cookie = `session_token=; path=/; max-age=;  ${makeSecure}`;
    }
}
