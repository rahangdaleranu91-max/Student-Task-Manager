//localStorage.removeItem("tasks");     Local Storage se "tasks" naam ki key aur uske andar saved data ko delete karna hai.
//localStorage.setItem("tasks", JSON.stringify(tasks));    Yahan "tasks" key mein tumhare saare tasks save hote hain.


//localStorage.removeItem("tasks");
 let button=document.getElementById("btn");
 let input=document.getElementById("inputfield");
 let taskList=document.getElementById("taskList");
 let alltask=document.getElementById("alltask");
 let complete=document.getElementById("complete");
 let pending=document.getElementById("pending");

 let alltasks=document.getElementById("alltasksbtn");
 let completebtn=document.getElementById("completebtn");
 let pendingbtn=document.getElementById("pendingbtn");

 
 let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
 let currentFilter = localStorage.getItem("currentFilter") || "all";
 // localStorage.getItem("tasks") — saved data laata hai.
// JSON.parse() — us data ko array mein badalta hai.
// || [] — agar saved data nahi hai, toh empty array deta hai.



//is function ka kam hai saved task ko webpage pr dikhana
function renderTask(taskObj) {
    let li = document.createElement("li");
    let span = document.createElement("span");
    span.textContent = taskObj.text;
    li.appendChild(span);
    taskList.appendChild(li);

    if (taskObj.completed) {
    span.style.textDecoration = "line-through";
    }

    if (taskObj.completedAt) {
    completedTimeText.textContent = "Completed at: " + taskObj.completedAt;
}

    let editbtn=document.createElement("button");
    editbtn.textContent="Edit";
    li.appendChild(editbtn);

    let taskcompletebtn = document.createElement("button");
    taskcompletebtn.textContent = "Complete";
    taskcompletebtn.classList.add("complete-btn");
    li.appendChild(taskcompletebtn);

     let deletebtn=document.createElement("button");
    deletebtn.textContent="Delete";
    deletebtn.classList.add("delete-btn");
    li.appendChild(deletebtn);

   let timeText = document.createElement("small");
   if (taskObj.completed && taskObj.completedAt) {
         timeText.textContent = "Completed at: " + taskObj.completedAt;
    }
    else {
    timeText.textContent = "Created at: " + taskObj.createdAt;
    }

    li.appendChild(timeText);

    
    taskcompletebtn.addEventListener("click", function() {
    span.style.textDecoration = "line-through";
    taskObj.completed = true;
    if (taskObj.completedAt === null) {
         taskObj.completedAt = new Date().toLocaleString();
     }
    timeText.textContent = "Completed at: " + taskObj.completedAt;
    localStorage.setItem("tasks", JSON.stringify(tasks));
});


    let editinput=document.createElement("input");
    

    editbtn.addEventListener("click", function() {
    if (editbtn.textContent === "Edit") {
        editinput.value = span.textContent;
        span.replaceWith(editinput);
        editbtn.textContent = "Save";
    } else {
        let newtask = editinput.value.trim();

        if (newtask === "") {
            alert("Task cannot be empty!");
            return;
        }

        taskObj.text = newtask;
        taskObj.createdAt = new Date().toLocaleString();
        localStorage.setItem("tasks", JSON.stringify(tasks));
        timeText.textContent=taskObj.createdAt;

        span.textContent = newtask;
        editinput.replaceWith(span);
        editbtn.textContent = "Edit";
    }
});

    deletebtn.addEventListener('click',function(){
        tasks=tasks.filter(function(item){
            return item!==taskObj;
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
        li.remove();
        alltask.textContent="Total Task: "+tasks.length;
         updateCounts();
        //  alltask.textContent = "Total Task: " + taskList.querySelectorAll("li").length;
        //  updateCounts();
        });
}


//is function ka kam hai total,complete,and pending task ko update karna
 function updateCounts(){
     let completeCount=0;
     let tasks=taskList.querySelectorAll("li");
     for(let task of tasks)
     {
        let span=task.querySelector("span");
        if(span.style.textDecoration=="line-through")
        {
            completeCount++;
        }
     }
    complete.textContent="Complete:"+completeCount;

    let pendingCount=tasks.length-completeCount;
    pending.textContent="Pending:"+pendingCount;
 }


//ye function selected filter ke hisab se tasks show hide karenga

function applyFilter(filter) {
    let taskItems = taskList.querySelectorAll("li");

    for (let task of taskItems) {
        let taskText = task.querySelector("span");
        let isCompleted = taskText &&
            taskText.style.textDecoration === "line-through";

        if (filter === "complete") {
            task.style.display = isCompleted ? "" : "none";
        } else if (filter === "pending") {
            task.style.display = !isCompleted ? "" : "none";
        } else {
            task.style.display = "";
        }
    }
}




//span tag ka us eisliye kiye kyunki :- button add karne me easy,text ko alag se style karne ke liye,li(list item) ko chheede bina span tag ke ander ke text ko jab chahe badal sakte hai
 function addTask(){
     let task=input.value;
     if(task.trim()!=="")
     {    
         let li=document.createElement("li"); 
         let span=document.createElement("span");
         span.textContent=task;                     //span me rakha hai kyunki edit karte wakt sirf text update ho or koi affect na pde
         li.appendChild(span);                      //task ko webpage pr dikhana
         taskList.appendChild(li);


         //task ko array or local storage me save karna:-
         let taskObj={
            text: task,
            completed:false,
            createdAt:new Date().toLocaleString(),
            completedAt:null
        };
        tasks.push(taskObj);
        localStorage.setItem("tasks",JSON.stringify(tasks));
        


         alltask.textContent= "Total Task:" + taskList.querySelectorAll("li").length;
         updateCounts();
         input.value="";                   //input.value=null; 



        
        //edit button:-
        let isEditing=false;  //abhi editing chalu nhi hui hai
        let editbtn=document.createElement("button");
        editbtn.textContent="Edit";
        editbtn.classList.add("edit-btn");      //CSS me access karne ke liye
        li.appendChild(editbtn);
        let editinput=document.createElement("input");

        editbtn.addEventListener('click',function(){ 
            if(isEditing===false){
                 editinput.value=span.textContent;
                 span.replaceWith(editinput);
                 editbtn.textContent="save";
                 isEditing=true;
            }
            else{
                 let newtask=editinput.value;
                 if(newtask==="")
                 {
                    alert("Task cannot be empty!");
                    return;
                 }

                 let oldTask=span.textContent;
                 let foundTask=tasks.find(function(item){
                    return item.text===oldTask;
                 });
                 foundTask.text=newtask;
                 localStorage.setItem("tasks", JSON.stringify(tasks));    //setItem() changes save karta hai.


                 span.textContent=newtask;
                 let editedTime=new Date();
                 Time.textContent="Edited On: "+editedTime.toLocaleString();

                 editinput.replaceWith(span);  //ye line screen se input box ko hta deti hai
                 editbtn.textContent="Edit";
                 isEditing=false;
                }
        });



        //complete button:-har inputfield ke sath wali button
        let taskcompletebtn=document.createElement("button");
        taskcompletebtn.textContent="Complete";
        
        taskcompletebtn.classList.add("complete-btn");      //CSS me access karne ke liye

        li.appendChild(taskcompletebtn);

         let deletebtn=document.createElement("button");
         deletebtn.textContent="Delete";
         deletebtn.classList.add("delete-btn");         //Css property delete button pr
         li.appendChild(deletebtn);


        let addTime=new Date();
         let Time=document.createElement("p");
         Time.style.display = "inline";//ek line me line me lane ke liye
         Time.style.marginLeft = "10px";
         li.appendChild(Time);
         Time.textContent=addTime.toLocaleString();
         let editedTimeText = document.createElement("p");
         li.appendChild(editedTimeText);


         //delete button bnana:-

         deletebtn.addEventListener('click',function(){
            tasks=tasks.filter(function(item){
                return item.text!==span.textContent;
            });
             localStorage.setItem("tasks",JSON.stringify(tasks));
             li.remove();
             updateCounts();
             alltask.textContent= "Total Task:" + taskList.querySelectorAll("li").length;

         });
  

         taskcompletebtn.addEventListener('click',function(){
            if(span.style.textDecoration !== "line-through")
            {
                  span.style.textDecoration="line-through";
                  taskObj.completed = true;
                  localStorage.setItem("tasks", JSON.stringify(tasks));
                  updateCounts();
                //   let Datee=document.createElement("p");
                //   li.appendChild(Datee);
                //   let completeTime=new Date();
                //   Datee.textContent="Completed On: "+completeTime.toLocaleString();
                let completeTime = new Date();
                completedTimeText.textContent = "Completed On: " + completeTime.toLocaleString();
            }
         });
    }  
}

//Page loadhone pr saved Task dikhana:-
tasks.forEach(function(taskObj){         //forEach()-array ke har element par function chalata hai.
    renderTask(taskObj);
});
alltask.textContent="Total Task: "+tasks.length;
updateCounts();
applyFilter(currentFilter);



button.addEventListener('click',addTask);

input.addEventListener('keydown',function(event){
    if(event.key==="Enter")
    {
        addTask();
    }
});

// 3 मुख्य Keyboard Events

// 1. keydown: जब आप कीबोर्ड की कोई बटन दबाते हैं (सबसे ज़्यादा इस्तेमाल होता है)।
// 2. keypress: जब आप कोई बटन दबाकर रखते हैं (अब यह पुराना/Deprecated हो चुका है)।
// 3. keyup: जब आप बटन दबाकर छोड़ते हैं।


alltasks.addEventListener("click", function() {
    currentFilter = "all";
    localStorage.setItem("currentFilter", currentFilter);
    applyFilter(currentFilter);
});

completebtn.addEventListener("click", function() {
    currentFilter = "complete";
    localStorage.setItem("currentFilter", currentFilter);
    applyFilter(currentFilter);
});

pendingbtn.addEventListener("click", function() {
    currentFilter = "pending";
    localStorage.setItem("currentFilter", currentFilter);
    applyFilter(currentFilter);
});