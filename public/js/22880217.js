"use strict";
function addExample() {
    const container = document.getElementById('examples-container');

    const newGroup = document.createElement('div');
    newGroup.className = 'example-group';

    newGroup.innerHTML = `
      <textarea class="form-control mb-0" name="examples[]" placeholder="Nhập ví dụ minh họa..." rows="3"></textarea>
      <div class="text-right">
                                            <button type="button" class="btn btn-danger"
                                                onclick="removeExample(this)"><i class="fa fa-remove"></i></button>
                                        </div>
    `;

    container.appendChild(newGroup);
}
function removeExample(button) {
    const container = button.closest('.example-group');
    if (container) {
        container.remove();
    }
}
async function addCart(id, quantity) {
    let res = await fetch('/products/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ id, quantity })
    });
    let json = await res.json();
    document.getElementById('cart-quantity').innerText = `(${json.quantity})`;
}

async function updateCart(id, quantity) {
    if (quantity > 0) {
        let res = await fetch('/products/cart', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ id, quantity })
        });
        if (res.status == 200) {
            let json = await res.json();
            document.getElementById('cart-quantity').innerText = `(${json.quantity})`;
            document.getElementById('subtotal').innerText = `$${json.subtotal}`;
            document.getElementById('total').innerText = `$${json.total}`;
            document.getElementById(`total${id}`).innerText = `$${json.item.total}`;
        }

    }
    else {
        removeCart(id);
    }

}

async function removeCart(id) {
    if (confirm('Are you sure you want to remove this product from the cart?')) {
        let res = await fetch('/products/cart', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ id })
        });
        if (res.status == 200) {
            let json = await res.json();
            document.getElementById('cart-quantity').innerText = `(${json.quantity})`;
            if (json.quantity > 0) {
                document.getElementById('subtotal').innerText = `$${json.subtotal}`;
                document.getElementById('total').innerText = `$${json.total}`;
                document.getElementById(`product${id}`).remove();
            } else {
                document.querySelector('.cart-page .container').innerHTML = `<div class="text-center border py-3">
            <h3>Your cart is empty!</h3>
            </div>`;
            }

        }

    }

}

async function clearCart() {
    if (confirm('Are you sure you want to remove all cart?')) {
        let res = await fetch('/products/cart/all', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        if (res.status == 200) {
            document.getElementById('cart-quantity').innerText = `(0)`;
            document.querySelector('.cart-page .container').innerHTML = `<div class="text-center border py-3">
            <h3>Your cart is empty!</h3>
            </div>`

        }

    }
}

function placeorders(e) {
    e.preventDefault();
    const addressId = document.querySelector('input[name=addressId]:checked')
    if (!addressId || addressId.value == 0) {
        if (!e.target.checkValidity()) {
            return e.target.reportValidity();
        }
    }
    e.target.submit();
}

function checkConfirmPassword(formId) {
    let password = document.querySelector(`#${formId} [name=password]`);
    let confirmPassword = document.querySelector(`#${formId} [name=confirmPassword]`)
    if (password.value != confirmPassword.value) {
        confirmPassword.setCustomValidity('Passwords not match!');
        confirmPassword.reportValidity();
    } else {
        confirmPassword.setCustomValidity('')
    }
}

function playAudio(id) {
    const audio = document.getElementById(id);
    if (audio) {
        audio.play();
    }
}

async function updateLearnedState(id) {
    const checkbox = document.getElementById(`is_Learned_${id}`);
    if (checkbox) {
        const isLearned = checkbox.checked;
        let res = await fetch(`/updateState/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isLearned: isLearned })
        })
        if (res.status == 200) {
            alert('Cập nhật thành công!');
            window.location.reload();
        }
        else {
            alert('Cập nhật thất bại! Lỗi phía server.');
        }

    }
    else {
        alert('Cập nhật thất bại! Lỗi không tìm thấy checkbox.');
    }

}

function attachDeleteHandlers(buttonSelector = '.btn-delete', deleteUrlPrefix = '/vocabulary/delete/') {
    document.querySelectorAll(buttonSelector).forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const id = this.getAttribute('data-id');
            showDeleteConfirmation(id, deleteUrlPrefix);
        });
    });
}

function showDeleteConfirmation(id, deleteUrlPrefix) {
    Swal.fire({
        title: 'Bạn có chắc muốn xóa?',
        text: 'Thao tác này không thể hoàn tác!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
    }).then(result => {
        if (result.isConfirmed) {
            fetch(`${deleteUrlPrefix}${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Xóa thất bại');
                    }
                    return response.json();
                })
                .then(data => {
                    Swal.fire('Đã xóa!', '', 'success').then(() => {
                        location.reload();
                    });
                })
                .catch(error => {
                    Swal.fire('Lỗi', error.message, 'error');
                });
        }
    });
}

function checkFill(id) {
    let userInputId = `id-${id}_userFill`
    let resultId = `id-${id}_result`
    let resultResponse = `fillResult_id-${id}`
    let audioId = `audio-${id}`

    const input = document.getElementById(userInputId).value.trim().toLowerCase();
    const result = document.getElementById(resultId).value;
    const resultElement = document.getElementById(resultResponse);
    if (input === result) {
        resultElement.textContent = `✅ Chính xác! '${result}' là đáp án đúng.`;
        resultElement.classList.add('text-success');
        resultElement.classList.remove('text-danger');
        playAudio(audioId)
    } else {
        resultElement.textContent = `❌ Sai rồi. Đáp án đúng là '${result}'.`;
        resultElement.classList.add('text-danger');
        resultElement.classList.remove('text-success');
    }
}
function checkMCQ(id) {
    console.log('checkMCQ word id: ', id)

    const selected = document.querySelector(`input[name='mcq_${id}']:checked`).value;
    const result = document.querySelector(`input[name='mcq_${id}_result']`).value;
    const resultElement = document.getElementById(`mcqResult_${id}`);
    if (selected === result) {
        resultElement.textContent = `✅ Chính xác! '${result}' là đáp án đúng.`;
        resultElement.classList.add('text-success');
        resultElement.classList.remove('text-danger');
        playAudio(`audio-${id}`)
    } else {
        resultElement.textContent = `❌ Sai rồi. Đáp án đúng là '${result}'.`;
        resultElement.classList.add('text-danger');
        resultElement.classList.remove('text-success');
    }
}