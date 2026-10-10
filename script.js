let data = JSON.parse(localStorage.getItem("moneymap")||"[]");
let currentType = "expense";
const balanceEl=document.getElementById("balance"), incomeEl=document.getElementById("income"), expenseEl=document.getElementById("expense"), listEl=document.getElementById("list"), chart=document.getElementById("chart");
document.getElementById("date").innerText = new Date().toLocaleDateString("en-IN",{weekday:'long',day:'numeric',month:'short'});

document.querySelectorAll(".tab").forEach(t=>{
  t.onclick=()=>{
    document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
    t.classList.add("active");
    currentType=t.dataset.type;
  };
});

function drawChart(income, expense){
  let ctx=chart.getContext("2d"); let total=income+expense||1;
  ctx.clearRect(0,0,80,80);
  let expAngle=(expense/total)*2*Math.PI;
  ctx.beginPath(); ctx.moveTo(40,40); ctx.arc(40,40,36,0,expAngle); ctx.fillStyle="#111"; ctx.fill();
  ctx.beginPath(); ctx.moveTo(40,40); ctx.arc(40,40,36,expAngle,2*Math.PI); ctx.fillStyle="#16a34a"; ctx.fill();
  ctx.beginPath(); ctx.arc(40,40,22,0,2*Math.PI); ctx.fillStyle="#fff"; ctx.fill();
}

function render(){
  let inc=0, exp=0;
  data.forEach(d=> d.type==="income"? inc+=+d.amount : exp+=+d.amount);
  balanceEl.innerText=`₹${inc-exp}`; incomeEl.innerText=`₹${inc}`; expenseEl.innerText=`₹${exp}`;
  drawChart(inc,exp);
  listEl.innerHTML = data.length?"":"<p style='text-align:center;color:#999;padding:20px'>No data yet. Add your first transaction!</p>";
  data.slice().reverse().forEach(d=>{
    listEl.innerHTML+=`<div class="item">
      <div class="item-left">
        <div class="dot">${d.category.split(" ")[0]}</div>
        <div><b>${d.title}</b><small>${d.category.slice(2)} • ${d.date}</small></div>
      </div>
      <div class="item-right">
        <div class="amt ${d.type}">${d.type==="income"?"+":"-"}₹${d.amount}</div>
        <button class="del" onclick="del(${d.id})">Delete</button>
      </div>
    </div>`;
  });
  localStorage.setItem("moneymap", JSON.stringify(data));
}

document.getElementById("addBtn").onclick=()=>{
  let title=document.getElementById("title").value.trim();
  let amount=document.getElementById("amount").value;
  let category=document.getElementById("category").value;
  if(!title || !amount) return alert("Enter title & amount");
  data.push({id:Date.now(), type:currentType, title, amount:+amount, category, date:new Date().toLocaleDateString()});
  document.getElementById("title").value=""; document.getElementById("amount").value="";
  render();
};
window.del=id=>{ data=data.filter(d=>d.id!==id); render(); };
document.getElementById("clear").onclick=()=>{ if(confirm("Clear all?")){ data=[]; render(); } };
render();
