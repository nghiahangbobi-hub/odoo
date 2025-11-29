/** @odoo-module **/

/* Dùng JavaScript thuần (Vanilla JS) để chạy trên mọi phiên bản Odoo.
   Không phụ thuộc vào jQuery ($) hay web.ajax nữa.
*/

console.log("Ollama Chatbot đang khởi động (Vanilla JS)...");

function initChatbot() {
    // Tìm các thẻ HTML của chatbot
    const sendBtn = document.getElementById('ollama_chat_send');
    const inputField = document.getElementById('ollama_chat_input');
    const chatMessages = document.getElementById('ollama_chat_messages');

    // Nếu giao diện chưa vẽ xong, thử lại sau 1 giây (Logic an toàn cho Odoo)
    if (!sendBtn || !inputField || !chatMessages) {
        setTimeout(initChatbot, 1000);
        return;
    }

    console.log("Đã kết nối thành công với giao diện Chatbot!");

    // Xử lý khi bấm nút Gửi
    sendBtn.addEventListener('click', async function() {
        const msg = inputField.value;
        if (!msg) return;

        // 1. Hiển thị tin nhắn của BẠN
        const userHtml = `<div style="text-align:right; margin:5px;"><b>You:</b> ${msg}</div>`;
        chatMessages.insertAdjacentHTML('beforeend', userHtml);
        
        // Xóa ô nhập và cuộn xuống
        inputField.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // 2. Hiện trạng thái "Đang suy nghĩ..."
        const loadingId = 'loading_' + Date.now();
        const loadingHtml = `<div id="${loadingId}" style="color:gray; font-style:italic; margin:5px;">Bot is thinking...</div>`;
        chatMessages.insertAdjacentHTML('beforeend', loadingHtml);

        // 3. Gửi dữ liệu bằng FETCH API (Chuẩn quốc tế, không dùng Odoo RPC cũ)
        try {
            const response = await fetch("/ollama/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    params: { message: msg }
                }),
            });

            const resultJson = await response.json();
            
            // Xóa dòng loading
            const loadingEl = document.getElementById(loadingId);
            if(loadingEl) loadingEl.remove();

            if (resultJson.error) {
                 const errorMsg = `<div style="color:red;">Lỗi Server: ${resultJson.error.data.message}</div>`;
                 chatMessages.insertAdjacentHTML('beforeend', errorMsg);
            } else {
                const botReply = resultJson.result.reply;
                // 4. Hiển thị tin nhắn của BOT
                const botHtml = `<div style="text-align:left; margin:5px; color:#0056b3;"><b>Ollama:</b> ${botReply}</div>`;
                chatMessages.insertAdjacentHTML('beforeend', botHtml);
            }

        } catch (error) {
            const loadingEl = document.getElementById(loadingId);
            if(loadingEl) loadingEl.remove();
            
            console.error("Lỗi:", error);
            const errorHtml = `<div style="color:red;">Lỗi kết nối! (Xem F12 Console)</div>`;
            chatMessages.insertAdjacentHTML('beforeend', errorHtml);
        }

        // Cuộn xuống cuối cùng
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

// Khởi chạy
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
} else {
    initChatbot();
}