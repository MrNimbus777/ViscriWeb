const uploadButton = document.getElementById('uploadButton');
const avatarInput = document.getElementById('avatar');
const preview = document.getElementById('preview');

avatarInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

uploadButton.addEventListener('click', async () => {
    const file = avatarInput.files[0];
    if (!file) {
        console.log('no file');
        return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
        const response = await fetch('/upload-avatar/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': csrf_token,
                'token': session_token
            },
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Image uploaded successfully!');
        } else {
            console.log('Image upload failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});