let GLOBAL = {};

const txtb        = null;
const pending     = null;
const concluded   = null;
const editTask    = null;
const undoTask    = null;
const delTask     = null;
const endTask     = null;

$(document).ready(function() {
    
    GLOBAL.txtb      = $("<input>").attr("type", "text").attr("placeholder", "Descreva a tarefa...").addClass("txtb");
    GLOBAL.pending   = $("<div>").addClass("notcomp");
    GLOBAL.concluded = $("<div>").addClass("comp");
    
    //******************//
    
    $("body").html("").append(
        $(GLOBAL.txtb).keyup( (e) => {
            addTask(e);
        }),
        $(GLOBAL.pending).append(
            $("<h3>").text("Tarefas Pendentes")
        ),
        $(GLOBAL.concluded).append(
            $("<h3>").text("Tarefas Concluídas")
        )
    );
    
    //******************//
    
    let items = getLS();
    
    if (items.length > 0) {
        
        items.forEach((item) => {
            
            // Is it concluded?
            if (!item[1]) {
                addTask(null, item);
            } else {
                addConcludedTask(item);
            }
            
        });
        
    }// if (items)
    
});

//******************//

function endTaskFunc (event) {
    
    // This task
    let task = $(event.target).parent();
        
    //******************//
    
    task.fadeOut( () => {
        
        // Add concluded task in the list
        addConcludedTask(task);
        
        //******************//
        
        // Fade it
        task.fadeIn();
        
    });
        
    //******************//
    
    // Update data in Local Storage
    updateLS([task.text(), true]);
        
    //******************//
    
    // Remove task from pending list
    task.remove();
    
}// endTask

//******************//

function undoTaskFunc (event) {
    
    // This task
    let task = $(event.target).parent();
    
    GLOBAL.editTask  = $("<i class='editTask fas fa-edit' title='Edit task'></i>");
    GLOBAL.undoTask  = $("<i class='undoTask fas fa-undo' title='Put it back in the uncompleted tasks'></i>");
    GLOBAL.delTask   = $("<i class='delTask fas fa-trash-alt' title='Delete task'></i>");
    GLOBAL.endTask   = $("<i class='endTask fas fa-check' title='Finish task'></i>");
        
    //******************//
    
    task.fadeOut( () => {
        
        const newTask = $("<div>").addClass("task");
        
        //******************//
        
        $(GLOBAL.endTask).click( (ev) => {
            endTaskFunc(ev);
        });
        
        //******************//
        
        $(GLOBAL.editTask).click( (ev) => {
            editTaskFunc(ev);
        });
        
        //******************//
        
        $(GLOBAL.delTask).click( (ev) => {
            delTaskFunc(ev);
        });
        
        //******************//
        
        // Create task element
        $(newTask).append(
            task.text(), 
            $(GLOBAL.endTask),
            $(GLOBAL.editTask),
            $(GLOBAL.delTask)
        );
        
        //******************//
        
        // Insert content in completed tasks
        $(GLOBAL.pending).append(
            $(newTask)
        );
        
        //******************//
        
        // Fade it
        task.fadeIn();
        
    });
     
    //******************//
    
    // Update data in Local Storage
    updateLS([task.text(), false]);
        
    //******************//
    
    // Remove task from pending list
    task.remove();
    
}// undoTaskFunc

//******************//

function editTaskFunc (event) {
    
    let task = $(event.target).parent();
        
    //******************//
            
    // Remove buttons
    task.find("i").remove();
        
    //******************//
    
    let text = $(task).text();
        
    //******************//
    
    // Add text to input
    $(GLOBAL.txtb).val(text);
        
    //******************//
    
    // Remove item from Local Storage
    removeLS([task.text()]);
        
    //******************//
    
    // Remove item
    task.fadeOut( () => {
        task.remove();
    });
    
}// editTaskFunc

//******************//

function delTaskFunc (event) {
    
    let task = $(event.target).parent();
        
    //******************//
    
    // Remove item from Local Storage
    removeLS([task.text()]);
        
    //******************//
        
    task.fadeOut( () => {
        task.remove();
    });
    
}// delTaskFunc

//******************//

function addConcludedTask (toDoItem) {
    
    let newTask = null;
    
    GLOBAL.editTask  = $("<i class='editTask fas fa-edit' title='Edit task'></i>");
    GLOBAL.undoTask  = $("<i class='undoTask fas fa-undo' title='Put it back in the uncompleted tasks'></i>");
    GLOBAL.delTask   = $("<i class='delTask fas fa-trash-alt' title='Delete task'></i>");
    GLOBAL.endTask   = $("<i class='endTask fas fa-check' title='Finish task'></i>");
    
    //******************//
    
    if ($.isArray(toDoItem)) {
        
        const text = toDoItem[0];
        
        //******************//
        
        newTask = $("<div>").addClass("task");
        
        //******************//
        
        $(newTask).append(
            text, 
            $(GLOBAL.endTask),
            $(GLOBAL.editTask),
            $(GLOBAL.delTask)
        );
        
    } else {
        
        newTask = toDoItem;
        
    }// else if ($.isArray(item))
    
    //******************//
    
    // Add undoTask button
    $(newTask).append(
        $(GLOBAL.undoTask).click( (ev) => {
            undoTaskFunc(ev);
        })
    );
    
    //******************//
    
    // Find delTask button
    $(newTask).find(".delTask").click( (ev) => {
        delTaskFunc(ev);
    });
    
    //******************//
    
    // Find editTask button
    $(newTask).find(".editTask").click( (ev) => {
        editTaskFunc(ev);
    });
    
    //******************//
    
    // Remove endTask button
    $(newTask).find(".endTask").remove();
    
    //******************//
    
    // Insert content in completed tasks
    $(GLOBAL.concluded).append(
        $(newTask)
    );
    
}// addConcludedTask

//******************//

function addTask (event, item = null) {
    
    GLOBAL.editTask  = $("<i class='editTask fas fa-edit' title='Edit task'></i>");
    GLOBAL.delTask   = $("<i class='delTask fas fa-trash-alt' title='Delete task'></i>");
    GLOBAL.endTask   = $("<i class='endTask fas fa-check' title='Finish task'></i>");
    
    // 13 means enter button
    if (event && event.which == 13 && $(event.target).val() != "" || item) {
        
        let text = null;
        
        //******************//
        
        // From Local Storage?
        if (item) {
            
            text = item[0];
            
        } else {
            
            text = $(GLOBAL.txtb).val();
            
        }// if (item)
        
        //******************//
        
        const newTask = $("<div>").addClass("task");
        
        //******************//
        
        $(GLOBAL.endTask).click( (ev) => {
            endTaskFunc(ev);
        });
        
        //******************//
        
        $(GLOBAL.editTask).click( (ev) => {
            editTaskFunc(ev);
        });
        
        //******************//
        
        $(GLOBAL.delTask).click( (ev) => {
            delTaskFunc(ev);
        });
        
        //******************//
        
        // Create task element
        $(newTask).append(
            text, 
            $(GLOBAL.endTask),
            $(GLOBAL.editTask),
            $(GLOBAL.delTask)
        );
        
        //******************//
        
        // Add element to Pending tasks
        $(GLOBAL.pending).append(
            $(newTask)
        );
        
        //******************//
        
        // Add item to Local Storage
        if (!item) addLS([$(GLOBAL.txtb).val(), false]);
        
        //******************//
      
        // Clean it up
        $(GLOBAL.txtb).val("");
      
    }// if (event.which == 13 && $(event.target).val() != "" || item)
    
}// addTaskFunc

//******************//

// Add data to Local Storage
function addLS(toDoItem) {
    
    const toDoItems = getLS();
    let found       = false;
    
    // Look for registers in the list
    toDoItems.forEach((item) => {
        if (item[0] == toDoItem[0]) found = true; 
    });
    
    if (!found) localStorage.setItem('toDoItems', JSON.stringify([...toDoItems, toDoItem]));
    
}// addLS

//******************//

// Update data in Local Storage
function updateLS(toDoItem) {
    
    removeLS(toDoItem);
    addLS(toDoItem);
    
}// updateLS

//******************//

// Remove data from Local Storage
function removeLS(toDoItem) {
    
    const toDoItems = getLS();
    
    localStorage.setItem('toDoItems', JSON.stringify(toDoItems.filter( (id) => id[0] !== toDoItem[0])));
    
}// removeLS

//******************//

// Get data from Local Storage
function getLS() {
    
    const toDoItems = JSON.parse(localStorage.getItem('toDoItems'));
    
    return toDoItems === null ? [] : toDoItems;
    
}// getLS
