//create task class
class task {
    constructor(name, description, dueDate) {
        this.name = name;
        this.description = description
        this.dueDate = dueDate
        this.isCompleted = false;
    }
}
let dailyTaskArray = [];
let projectArray = [];




//project class
class project {
    constructor(name) {
        this.name = name;
        this.tasks = []
    }
}


// Add event listener to the daily button
document.querySelector('#dailyBtn').addEventListener('click', () => {
    renderDailyPage();
});

function renderDailyPage() {
    const main = document.getElementById('main');
    main.innerHTML = ''; // Clear existing content

    const content = `
        <h2 class="mainTitle">seize the day.</h2>
        <p id="desrip">add your 3 top priorities for each timeblock.</p>

        <div class="timeBlock">
            <h3 class="timeBlocktitle">morning</h3>
            ${createTaskBlock(0)}
            ${createTaskBlock(1)}
            ${createTaskBlock(2)}
        </div>

        <div class="timeBlock">
            <h3 class="timeBlocktitle">afternoon</h3>
            ${createTaskBlock(3)}
            ${createTaskBlock(4)}
            ${createTaskBlock(5)}
        </div>

        <div class="timeBlock">
            <h3 class="timeBlocktitle">evening</h3>
            ${createTaskBlock(6)}
            ${createTaskBlock(7)}
            ${createTaskBlock(8)}
        </div>
    `;

    main.innerHTML = content;
    

    // Reattach event listeners
    attachEventListeners();
}

function createGenericTaskBlock(task, id, arrayName) {
    const isChecked = task && task.isCompleted ? 'checked' : '';
    const strikethrough = task && task.isCompleted ? 'completed' : '';

    return `
        <div class="taskBlocks" id="${arrayName}-${id}">
            <input type="checkbox" id="${arrayName}Task${id}" name="${arrayName}Task${id}" value="${arrayName}Task${id}" ${isChecked} ${!task ? 'disabled' : ''}>
            <label class="taskTitle ${strikethrough}" for="${arrayName}Task${id}" id="${arrayName}Label${id}">${task ? task.name : ''}</label>
            <button class="taskBtn trash"><i class="fa fa-trash"></i></button>
            <button class="taskBtn edit"><i class="fa fa-edit"></i></button>
            ${task ? `<button class="taskBtn expand" id="${arrayName}Expand${id}"><i class="fa fa-expand"></i></button>` : ''}
        </div>
    `;
}

function createTaskBlock(id) {
    return createGenericTaskBlock(dailyTaskArray[id], id, 'daily');
}

function createProjectTaskBlock(task, id) {
    return createGenericTaskBlock(task, id, 'project');
}

function attachEventListeners() {
    // Reattach event listeners for edit buttons
    const editBtns = document.querySelectorAll('.taskBtn.edit');
    editBtns.forEach(element => {
        element.addEventListener('click', handleEditClick);
    });

    // Reattach event listeners for delete buttons
    const delBtns = document.querySelectorAll('.taskBtn.trash');
    delBtns.forEach(element => {
        element.addEventListener('click', handleDeleteClick);
    });

    // Reattach event listeners for checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', checkBoxCheck);
    });

    //Reattach event listeners for expand buttons
    const expandBtns = document.querySelectorAll('.taskBtn.expand');
    expandBtns.forEach(element => {
        element.addEventListener('click', handleExpand);
    })
}

function attachProjectEventListeners(projObj) {
    // Attach event listeners for edit buttons
    const editBtns = document.querySelectorAll('.project-tasks .taskBtn.edit');
    editBtns.forEach((element, index) => {
        element.addEventListener('click', (event) => handleProjectEditClick(event, projObj, index));
    });

    // Attach event listeners for delete buttons
    const delBtns = document.querySelectorAll('.project-tasks .taskBtn.trash');
    delBtns.forEach((element, index) => {
        element.addEventListener('click', (event) => handleProjectDeleteClick(event, projObj, index));
    });

    // Attach event listeners for checkboxes
    const checkboxes = document.querySelectorAll('.project-tasks input[type="checkbox"]');
    checkboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('click', (event) => handleProjectCheckBoxCheck(event, projObj, index));
    });

    // Attach event listeners for expand buttons
    const expandBtns = document.querySelectorAll('.project-tasks .taskBtn.expand');
    expandBtns.forEach((element, index) => {
        element.addEventListener('click', () => handleProjectExpand(projObj, index));
    });
}

function handleProjectEditClick(event, projObj, index) {
    
    const taskLabel = document.getElementById(`projectLabel${index}`);
    
    const editDialog = document.createElement('dialog');
    editDialog.id = 'editDialog';

    const currentTask = projObj.tasks[index];
    editDialog.innerHTML = `
    <form id="editForm" method="dialog">
        <label for="taskTitle">Task Title:</label>
        <input type="text" id="taskName" name="taskTitle" value="${currentTask.name}" required>

        <label for="dueDate">Due Date:</label>
        <input type="date" id="dueDate" name="dueDate" value="${currentTask.dueDate}">

        <input id="submitBtn" type="submit" value="Submit">
        <button type="button" id="cancelBtn">Cancel</button><br><br>

        <label for="taskDescrip" id="taskD">Task Description:</label><br>
        <textarea id="taskDescrip" name="taskDescrip" rows="3" cols="65" placeholder="enter description here">${currentTask.description}</textarea>
    </form>`;
    
    document.body.appendChild(editDialog);

    const cancelBtn = editDialog.querySelector('#cancelBtn');
    cancelBtn.addEventListener('click', () => {
        editDialog.close();
        editDialog.remove();
    });

    editDialog.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();

        const taskName = document.getElementById('taskName').value.trim();
        const dueDate = document.getElementById('dueDate').value;
        const taskDescrip = document.getElementById('taskDescrip').value.trim();

        currentTask.name = taskName;
        currentTask.dueDate = dueDate;
        currentTask.description = taskDescrip;
        taskLabel.innerText = taskName;

        console.log(projObj.tasks[index]);
        editDialog.close();
        editDialog.remove();
    });

    editDialog.showModal();
}

function handleProjectDeleteClick(event, projObj, index) {
    const taskDiv = event.target.closest('.taskBlocks');
    
    // Remove the task from the project's tasks array
    projObj.tasks.splice(index, 1);
    
    // Remove the task div from the DOM
    taskDiv.remove();
    
    console.log(projObj.tasks);
    
    // Re-render the project page to update task indices
    renderProjectPage(projObj);
}

function handleProjectCheckBoxCheck(event, projObj, index) {
    const checkbox = event.target;
    const taskLabel = document.getElementById(`projectLabel${index}`);
    let isChecked = checkbox.checked;
    console.log(isChecked);

    if (projObj.tasks[index] != null) {
        if (isChecked) {
            taskLabel.style.textDecoration = 'line-through';
            projObj.tasks[index].isCompleted = true;
        } else {
            taskLabel.style.textDecoration = 'none';
            projObj.tasks[index].isCompleted = false;
        }
        console.log(projObj.tasks[index]);
    }
}

function handleProjectExpand(projObj, index) {
    const expandDialog = document.createElement('dialog');
    expandDialog.id = 'expandDialog';
    
    const currentTask = projObj.tasks[index];
    
    expandDialog.innerHTML = `
        <button type="button" id="closeBtn"><i class="fa fa-close"></i></button>
        <h1 id="expandTitle"> Task: ${currentTask.name} </h1>
        <p id="expandDate"> Due Date: ${currentTask.dueDate}</p>
        <p id="expandInfo"> ${currentTask.description} </p>
    `;
    
    document.body.appendChild(expandDialog);
    
    const closeBtn = expandDialog.querySelector('#closeBtn');
    closeBtn.addEventListener('click', () => {
        expandDialog.close();
        expandDialog.remove();
    });
    
    expandDialog.showModal();
}









// Event handler for edit button (you'll need to define this based on your existing code)
function handleEditClick(event) {

        const taskDiv = event.target.closest('.taskBlocks');
        //get id of task block
        const taskDivId = taskDiv.id;
        const taskBlock = taskDivId.charAt(taskDivId.length - 1);
        console.log(typeof(taskBlock));

        //get label element
        const taskLabel = document.getElementById('dailyLabel'.concat(taskBlock));
        // Create the dialog element dynamically
        const editDialog = document.createElement('dialog');
        editDialog.id = 'editDialog';

        if (dailyTaskArray[taskBlock] == null) {
            editDialog.innerHTML = `
        <form method="dialog">
        <label for="taskTitle">Task Title:</label>
        <input type="text" id="taskName" name="taskTitle" required>

        <label for="dueDate">Due Date:</label>
        <input type="date" id="dueDate" name="dueDate">

        <input id="submitBtn" type="submit" value="Submit">
        <button type="button" id="cancelBtn">Cancel</button><br><br>

        <label for="taskDescrip" id="taskD">Task Description:</label><br>
        <textarea id="taskDescrip" name="taskDescrip" rows="3" cols="65" placeholder="enter description here"></textarea>
        </form>
        `;
           
        } else {
            const currentTask = dailyTaskArray[taskBlock];
            editDialog.innerHTML = `
        <form id="editForm" method="dialog">
            <label for="taskTitle">Task Title:</label>
            <input type="text" id="taskName" name="taskTitle" value="${currentTask.name}" required>

            <label for="dueDate">Due Date:</label>
            <input type="date" id="dueDate" name="dueDate" value="${currentTask.dueDate}">

            <input id="submitBtn" type="submit" value="Submit">
            <button type="button" id="cancelBtn">Cancel</button><br><br>

            <label for="taskDescrip" id="taskD">Task Description:</label><br>
            <textarea id="taskDescrip" name="taskDescrip" rows="3" cols="65" placeholder="enter description here">${currentTask.description}</textarea>
        </form>`;
        }
        
        document.body.appendChild(editDialog);

        const cancelBtn = editDialog.querySelector('#cancelBtn');
            cancelBtn.addEventListener('click', () => {
                editDialog.close();
                editDialog.remove();
            });

        // Add event listener for form submission to close and remove the dialog
        editDialog.querySelector('form').addEventListener('submit', () => {
            event.preventDefault();

            const taskName = document.getElementById('taskName').value.trim();
            const dueDate = document.getElementById('dueDate').value;
            const taskDescrip = document.getElementById('taskDescrip').value.trim();

            if (dailyTaskArray[taskBlock] != null) {
                const existingTask = dailyTaskArray[taskBlock];
                existingTask.name = taskName;
                existingTask.dueDate = dueDate;
                existingTask.description = taskDescrip;
                taskLabel.innerText = taskName;
            } else {
                const newTask = new task(taskName, taskDescrip, dueDate)
                dailyTaskArray[taskBlock] = newTask;
                console.log(dailyTaskArray);
                console.log(taskBlock);
                taskLabel.innerText = taskName;
                const expandBtn = document.createElement('button');
                expandBtn.classList.add('taskBtn', 'expand');

                // Create the icon element (adjust class names if needed)
                const expandIcon = document.createElement('i');
                expandIcon.classList.add('fa', 'fa-expand');

                // Add the icon to the button
                expandBtn.appendChild(expandIcon);
                //add id to be able to remove
                expandBtn.id = 'dailyExpand'.concat(taskBlock);
                taskDiv.appendChild(expandBtn);
                
                expandBtn.addEventListener('click', (event) => {
                    const taskDiv = event.target.closest('.taskBlocks');
                    //get id of task block
                    const taskDivId = taskDiv.id;
                    const taskBlock = taskDivId.charAt(taskDivId.length - 1);
                    console.log(taskBlock);
            
                    // Create the dialog element dynamically
                    const expandDialog = document.createElement('dialog');
                    expandDialog.id = 'expandDialog';
            
                    const currentTask = dailyTaskArray[taskBlock];
                    console.log(currentTask);
            
                        expandDialog.innerHTML = `
                            <button type="button" id="closeBtn"><i class="fa fa-close"></i></button>
                            <h1 id="expandTitle"> Task: ${currentTask.name} </h1>
                            <p id="expandDate"> Due Date: ${currentTask.dueDate}</p>
                            <p id="expandInfo"> ${currentTask.description} </p>
                        `;
                        
                        document.body.appendChild(expandDialog);
            
                        const closeBtn = expandDialog.querySelector('#closeBtn');
                        closeBtn.addEventListener('click', () => {
                            expandDialog.close();
                            expandDialog.remove();
                            });
            
                        expandDialog.showModal();
                    });
                //enable checkbox
                const checkBox = document.getElementById('dailyTask'.concat(taskBlock));
                checkBox.disabled = false;
            }
            console.log(dailyTaskArray[taskBlock]);
            editDialog.close();
            editDialog.remove();
        });
        editDialog.showModal();
};

// Event handler for delete button (you'll need to define this based on your existing code)
function handleDeleteClick(event) {
    const taskDiv = event.target.closest('.taskBlocks');
    //get id of task block
    const taskDivId = taskDiv.id;
    const taskBlock = taskDivId.charAt(taskDivId.length - 1);
    console.log(taskBlock);
        if (dailyTaskArray[taskBlock] != null) {
            //get label element
            const taskLabel = document.getElementById('dailyLabel'.concat(taskBlock));
            taskLabel.innerText = "";

            //remove expand button
            const expandBtn = document.getElementById('dailyExpand'.concat(taskBlock));
            expandBtn.remove();
            //delete task object from array
            dailyTaskArray[taskBlock] = null;
            console.log(dailyTaskArray)
        }

        //disable checkbox box
        const checkBox = document.getElementById('dailyTask'.concat(taskBlock));
        checkBox.checked = false;
        checkBox.disabled = true;
}

function checkBoxCheck(event) {
    const checkbox = event.target;
    const taskDiv = event.target.closest('.taskBlocks');
    //get id of task block
    const taskDivId = taskDiv.id;
    const taskBlock = taskDivId.charAt(taskDivId.length - 1);
    console.log(taskBlock);
    const taskLabel = document.getElementById('dailyLabel'.concat(taskBlock));
    let isChecked = checkbox.checked;
    console.log(isChecked)

    
    if (isChecked && dailyTaskArray[taskBlock] != null) {
      taskLabel.style.textDecoration = 'line-through';
      dailyTaskArray[taskBlock].isCompleted = isChecked;
    } else if (!isChecked && dailyTaskArray[taskBlock] != null) {
      taskLabel.style.textDecoration = 'none';
      dailyTaskArray[taskBlock].isCompleted = isChecked;
    }
}

function handleExpand(event) {
    
    const taskDiv = event.target.closest('.taskBlocks');
    //get id of task block
    const taskDivId = taskDiv.id;
    const taskBlock = taskDivId.charAt(taskDivId.length - 1);
    console.log(taskBlock);
    console.log(taskBlock);
            
    // Create the dialog element dynamically
    const expandDialog = document.createElement('dialog');
    expandDialog.id = 'expandDialog';
            
    const currentTask = dailyTaskArray[taskBlock]
            
        expandDialog.innerHTML = `
            <button type="button" id="closeBtn"><i class="fa fa-close"></i></button>
            <h1 id="expandTitle"> Task: ${currentTask.name} </h1>
            <p id="expandDate"> Due Date: ${currentTask.dueDate}</p>
            <p id="expandInfo"> ${currentTask.description} </p>
         `;
                        
         document.body.appendChild(expandDialog);
            
        const closeBtn = expandDialog.querySelector('#closeBtn');
        closeBtn.addEventListener('click', () => {
            expandDialog.close();
            expandDialog.remove();
        });
            
        expandDialog.showModal();           
}

renderDailyPage();

//project button
const addProj = document.getElementById('addProjBtn');
addProj.addEventListener('click', () => {
    // Create the project form element dynamically
    const projectForm = document.createElement('form');
    const sideMenu = document.getElementById('sideMenu')
    projectForm.innerHTML = `
    <form>
            <div class="input-button-container">
                <input type="text" id="projName" name="taskTitle" placeholder="enter project name" required>
                <button type="button" id="addBtn">add</button>
                <button type="button" id="cancelProj">cancel</button>
            </div>
        </form>
    `;
    sideMenu.appendChild(projectForm);

    const cancelBtn = projectForm.querySelector('#cancelProj');
        cancelBtn.addEventListener('click', () => {
            projectForm.remove();
        });
    
    const addBtn = projectForm.querySelector("#addBtn");
        addBtn.addEventListener('click', () => {
        const projName = document.getElementById('projName').value.trim();
        const projNameInput = document.getElementById('projName');

        if (!projName) {
            // Add validation feedback, e.g., a message or styling
            projNameInput.setCustomValidity("Project name is required");
            projNameInput.reportValidity();
            return; // Prevent adding the project if the name is empty
        }
    
        // Reset custom validity message in case the input becomes valid
        projNameInput.setCustomValidity("");

        //create the project Tabs
        const newProjTab = document.createElement('div');
        newProjTab.classList.add("projTabContainer");

        const projButton = document.createElement('button');
        projButton.classList.add("projTabs");
        projButton.innerText = projName;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add("deleteProjBtn");
        deleteButton.innerHTML = '<i class="fa fa-trash"></i>';

        newProjTab.appendChild(projButton);
        newProjTab.appendChild(deleteButton);


        //create project object & add to array
        const newProj = new project(projName);
    

        projButton.addEventListener('click', () => renderProjectPage(newProj));
        deleteButton.addEventListener('click', () => deleteProject(newProj, newProjTab));

        projectForm.remove(); 

        //add the project Tab
        sideMenu.appendChild(newProjTab);
    });

});

function renderProjectPage(projObj) {
    let currentProj = projObj;
    console.log(currentProj);
    const main = document.getElementById('main');
    main.innerHTML = ''; // Clear existing content

    const projectHeader = document.createElement('div');
    projectHeader.classList.add('project-header');

    const projHeader = document.createElement('h2');
    projHeader.innerText = projObj.name;
    projHeader.id = "projHeader";

    const addtaskBtn  = document.createElement('button');
    addtaskBtn.id = 'addprojtaskBtn';
    addtaskBtn.innerText = "+";
    addtaskBtn.addEventListener('click', () => createNewTask(currentProj));


    projectHeader.appendChild(projHeader);
    projectHeader.appendChild(addtaskBtn);

    main.appendChild(projectHeader);

    // Create and append task blocks for project tasks
    const taskContainer = document.createElement('div');
    taskContainer.classList.add('project-tasks');
    currentProj.tasks.forEach((task, index) => {
        taskContainer.innerHTML += createProjectTaskBlock(task, index);
    });
    main.appendChild(taskContainer);

    // Reattach event listeners for project tasks
    attachProjectEventListeners(currentProj);
    
}


function createNewTask(projObj) {
    // Create the dialog element dynamically
    const editDialog = document.createElement('dialog');
    editDialog.id = 'editDialog';

   
        editDialog.innerHTML = `
    <form method="dialog">
    <label for="taskTitle">Task Title:</label>
    <input type="text" id="taskName" name="taskTitle" required>

    <label for="dueDate">Due Date:</label>
    <input type="date" id="dueDate" name="dueDate">

    <input id="submitBtn" type="submit" value="Submit">
    <button type="button" id="cancelBtn">Cancel</button><br><br>

    <label for="taskDescrip" id="taskD">Task Description:</label><br>
    <textarea id="taskDescrip" name="taskDescrip" rows="3" cols="65" placeholder="enter description here"></textarea>
    </form>
    `;

    document.body.appendChild(editDialog);

    const cancelBtn = editDialog.querySelector('#cancelBtn');
            cancelBtn.addEventListener('click', () => {
                editDialog.close();
                editDialog.remove();
            });

        // Add event listener for form submission to close and remove the dialog
        editDialog.querySelector('form').addEventListener('submit', (event) => {
            event.preventDefault()
            const taskName = document.getElementById('taskName').value.trim();
            const dueDate = document.getElementById('dueDate').value;
            const taskDescrip = document.getElementById('taskDescrip').value.trim();

            
            const newTask = new task(taskName, taskDescrip, dueDate);
            projObj.tasks.push(newTask)
            
            //add new task to dom
            const newTaskIndex = projObj.tasks.length - 1;
            const taskContainer = document.querySelector('.project-tasks')
            
        
            let newTaskBar = `
            <div class="taskBlocks" id="project-${newTaskIndex}">
                <input type="checkbox" id="projectTask${newTaskIndex}" name="projectTask${newTaskIndex}" value="projectTask${newTaskIndex}">
                <label class="taskTitle" for="projectTask${newTaskIndex}" id="projectLabel${newTaskIndex}">${newTask.name}</label>
                <button class="taskBtn trash"><i class="fa fa-trash"></i></button>
                <button class="taskBtn edit"><i class="fa fa-edit"></i></button>
                <button class="taskBtn expand" id="projectExpand${newTaskIndex}"><i class="fa fa-expand"></i></button>
            </div>`;

            taskContainer.insertAdjacentHTML('beforeend', newTaskBar);

             

            // Attach event listeners to the new task
             attachProjectEventListeners(projObj);
            
            



            editDialog.close();
            editDialog.remove();
            
        });
        editDialog.showModal();
}

function deleteProject(projObj, projTab) {
    // Remove the project from the projectArray
    const index = projectArray.indexOf(projObj);
    if (index > -1) {
        projectArray.splice(index, 1);
    }

    // Remove the project tab from the DOM
    projTab.remove();

    // If the deleted project is currently displayed, clear the main content
    const currentProjHeader = document.getElementById('projHeader');
    if (currentProjHeader && currentProjHeader.innerText === projObj.name) {
        const main = document.getElementById('main');
        main.innerHTML = '';
    }


}