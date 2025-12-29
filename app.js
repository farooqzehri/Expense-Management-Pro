 if(!localStorage.getItem("isLoggedIn")){
  window.location.href = "login.html";
     }

    const amount = document.querySelector("#input");
    const category = document.querySelector("#select");
    const remarks = document.querySelector("#remarks");
    const card = document.querySelector("#card");
    const expensebtn = document.querySelector("#expensebtn");
    const cancelBtn = document.querySelector("#cancelBtn");
    const totalBox = document.querySelector("#total");
    const currencySelect = document.querySelector("#currency");

    let allexpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    let editIndex = null;
    let currentCurrency = "PKR";
    let chart;

    const rates = { PKR:1, USD:0.0036, AED:0.013 };

    const expenseCategories = [
      "Food","Petrol","Shopping","Haircut",
      "Other Expenses","Loan","Health","Travel"
    ];

    expenseCategories.forEach(c=>{
      category.innerHTML += `<option value="${c}">${c}</option>`;
    });

    function getDate(){
      const d = new Date();
      return `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`;
    }

    function save(){
      localStorage.setItem("expenses",JSON.stringify(allexpenses));
    }

    function formatAmount(val){
      return (val * rates[currentCurrency]).toFixed(2)+" "+currentCurrency;
    }

    function calculateTotal(){
      const total = allexpenses.reduce((s,i)=>s+Number(i.amount),0);
      totalBox.innerText = "Total Expense: " + formatAmount(total);
    }

    function renderChart(){
      const data = {};
      allexpenses.forEach(e=>{
        data[e.category]=(data[e.category]||0)+Number(e.amount);
      });

      if(chart) chart.destroy();

      chart = new Chart(document.getElementById("expenseChart"),{
        type:"doughnut",
        data:{
          labels:Object.keys(data),
          datasets:[{
            data:Object.values(data),
            backgroundColor:[
              "#6366f1","#22c55e","#f97316",
              "#ef4444","#14b8a6","#eab308"
            ]
          }]
        },
        options:{
          plugins:{ legend:{ labels:{ color:"#e5e7eb" } } }
        }
      });
    }

    function renderexpenses(){
      card.innerHTML="";
      allexpenses.forEach((item,index)=>{
        card.innerHTML+=`
        <div class="expense-card ${editIndex===index?"active":""}">
          <div>
            <h4>${formatAmount(item.amount)}</h4>
            <p>${item.remarks}</p>
            <span>${item.category} • ${item.date}</span>
          </div>
          <div class="actions">
            <button onclick="startEdit(${index})">Edit</button>
            <button class="danger" onclick="deleteExpense(${index})">Delete</button>
          </div>
        </div>`;
      });
      calculateTotal();
      renderChart();
    }

    expensebtn.addEventListener("click",()=>{
      if(!amount.value || !remarks.value) return;

      if(editIndex===null){
        allexpenses.push({
          amount:amount.value,
          category:category.value,
          remarks:remarks.value,
          date:getDate()
        });
      }else{
        allexpenses[editIndex].amount=amount.value;
        allexpenses[editIndex].category=category.value;
        allexpenses[editIndex].remarks=remarks.value;
        editIndex=null;
        expensebtn.innerText="Add Expense";
        cancelBtn.style.display="none";
      }

      amount.value="";
      remarks.value="";
      save();
      renderexpenses();
    });

    function deleteExpense(i){
      allexpenses.splice(i,1);
      save();
      renderexpenses();
    }

    function startEdit(i){
      editIndex=i;
      amount.value=allexpenses[i].amount;
      category.value=allexpenses[i].category;
      remarks.value=allexpenses[i].remarks;
      expensebtn.innerText="Update Expense";
      cancelBtn.style.display="inline-block";
      renderexpenses();
    }

    cancelBtn.addEventListener("click",()=>{
      editIndex=null;
      amount.value="";
      remarks.value="";
      expensebtn.innerText="Add Expense";
      cancelBtn.style.display="none";
      renderexpenses();
    });

    currencySelect.addEventListener("change",e=>{
      currentCurrency=e.target.value;
      renderexpenses();
    });

    renderexpenses();
    function logout(){
  localStorage.removeItem("isLoggedIn");
  window.location.href = "login.html";
}
