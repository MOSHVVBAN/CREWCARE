<?php require_once __DIR__ . '/config/session.php'; if (!empty($_SESSION['user_id'])) { header('Location: index.php'); exit; } ?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>CREWCARE · Account</title>
  <style>
    *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:radial-gradient(circle at 15% 15%,#163e58,#071525 55%,#050b16);font-family:Arial,sans-serif;color:#eef7ff;padding:24px}
    .wrap{width:min(440px,100%);padding:34px;border:1px solid #ffffff20;border-radius:24px;background:#10263bd9;box-shadow:0 24px 80px #0008}.brand{color:#55d7e7;font-weight:800;letter-spacing:3px}.tabs{display:flex;gap:10px;margin:24px 0}.tabs button{flex:1;padding:12px;border:1px solid #ffffff30;border-radius:12px;background:transparent;color:#fff;cursor:pointer}.tabs button.active{background:#38bfd1;color:#061624;font-weight:700}h1{font-size:28px;margin:12px 0}p{color:#b7c9d9;line-height:1.6}label{display:block;margin:14px 0 7px;color:#d9e8f3}input{width:100%;padding:14px;border:1px solid #ffffff25;border-radius:11px;background:#071a2b;color:white;outline:none}input:focus{border-color:#42d3e2}form button.submit{width:100%;margin-top:22px;padding:14px;border:0;border-radius:12px;background:#45cbd8;color:#06202c;font-weight:800;cursor:pointer}#authMessage{min-height:24px;margin-top:14px}.hidden{display:none}
  </style>
</head>
<body><main class="wrap"><div class="brand">CREWCARE</div><h1>Welcome to your mission</h1><p>Sign in or create an account to save your CrewCare records.</p>
  <div class="tabs"><button id="loginTab" class="active" type="button">Sign in</button><button id="registerTab" type="button">Create account</button></div>
  <form id="loginForm"><label>Email</label><input name="email" type="email" required autocomplete="email"><label>Password</label><input name="password" type="password" required autocomplete="current-password"><button class="submit">Sign in</button></form>
  <form id="registerForm" class="hidden"><label>Full name</label><input name="name" required maxlength="120" autocomplete="name"><label>Email</label><input name="email" type="email" required autocomplete="email"><label>Password (8 characters minimum)</label><input name="password" type="password" minlength="8" required autocomplete="new-password"><button class="submit">Create account</button></form>
  <div id="authMessage" role="status"></div>
</main>
<script src="api-client.js"></script><script src="auth.js"></script>
<script>
const lt=document.getElementById('loginTab'),rt=document.getElementById('registerTab'),lf=document.getElementById('loginForm'),rf=document.getElementById('registerForm');
lt.onclick=()=>{lf.classList.remove('hidden');rf.classList.add('hidden');lt.classList.add('active');rt.classList.remove('active')};
rt.onclick=()=>{rf.classList.remove('hidden');lf.classList.add('hidden');rt.classList.add('active');lt.classList.remove('active')};
</script></body></html>
