
const container=document.getElementById("issues-container");
const loader=document.getElementById("loader");
const issueCount=document.getElementById("issueCount");
const modal=document.getElementById("modal");

// Load all issues
async function loadIssues(){
  loader.classList.remove("hidden");
  setActiveTab('allTab');
  const res=await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
  const data=await res.json();
  displayIssues(data.data);
  loader.classList.add("hidden");
}

// Filter by status
async function filterStatus(status){
  loader.classList.remove("hidden");
  setActiveTab(status==='open'?'openTab':'closedTab');
  const res=await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
  const data=await res.json();
  const filtered=data.data.filter(issue=>issue.status===status);
  displayIssues(filtered);
  loader.classList.add("hidden");
}

// Search issues
async function searchIssue(){
  loader.classList.remove("hidden");
  const text=document.getElementById("searchInput").value;
  const res=await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`);
  const data=await res.json();
  displayIssues(data.data);
  loader.classList.add("hidden");
}

// Display cards
function displayIssues(issues){
  container.innerHTML="";
  issueCount.innerText=`Total Issues: ${issues.length}`;

  issues.forEach(issue=>{
    const div=document.createElement("div");
    const color=issue.status==="open"?"green":"purple";

    // Priority color: HIGH=Green, MEDIUM/LOW=Purple
    let priorityColor="";
    if(issue.priority==="HIGH") priorityColor="bg-green-200 text-green-700";
    else priorityColor="bg-purple-200 text-purple-700";

    div.className="bg-white p-4 rounded-xl shadow-lg border-t-4 cursor-pointer hover:shadow-2xl transition";
    div.style.borderTopColor=color;

    div.innerHTML=`
      <div class="flex justify-between items-center mb-2">
        <span class="text-green-600 text-xs">●</span>
        <span class="${priorityColor} text-xs px-2 py-1 rounded">${issue.priority}</span>
      </div>
      <h3 class="font-semibold text-sm">${issue.title}</h3>
      <p class="text-gray-500 text-xs mt-1">${issue.description}</p>
      <div class="flex gap-2 mt-3">
        <span class="bg-red-100 text-red-600 text-xs px-2 py-1 rounded flex items-center gap-1">🐞 BUG</span>
        <span class="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded flex items-center gap-1">⚠ HELP WANTED</span>
      </div>
      <p class="text-xs text-gray-400 mt-3">#${issue.id} by ${issue.author}</p>
      <p class="text-xs text-gray-400">${issue.createdAt}</p>
    `;

    div.onclick = () => openModal(issue.id);

    container.appendChild(div);
  });
}

// Open modal with animation
async function openModal(id){
  const res=await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
  const data=await res.json();
  const issue=data.data;

  document.getElementById("modalTitle").innerText=issue.title;
  document.getElementById("modalDesc").innerText=issue.description;
  document.getElementById("modalAuthor").innerText="Author: "+issue.author;
  document.getElementById("modalPriority").innerText="Priority: "+issue.priority;
  document.getElementById("modalLabel").innerText="Label: "+issue.label;

  modal.classList.remove("hidden");
  setTimeout(()=>modal.classList.add("show"),10); // smooth animation
}

// Close modal with animation
function closeModal(){
  modal.classList.remove("show");
  setTimeout(()=>modal.classList.add("hidden"),300);
}

// Active tab highlight
function setActiveTab(tabId){
  document.querySelectorAll('.tab').forEach(t=>{
    t.classList.remove('bg-purple-600','text-white');
    t.classList.add('bg-gray-200','text-black');
  });
  document.getElementById(tabId).classList.add('bg-purple-600','text-white');
  document.getElementById(tabId).classList.remove('bg-gray-200','text-black');
}

// Initial load
loadIssues();
