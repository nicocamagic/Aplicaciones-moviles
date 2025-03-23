import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBTzyt8hbFHQzs4KOA0Qz3_MvqTVGETank",
    authDomain: "inventario-2025-d402d.firebaseapp.com",
    projectId: "inventario-2025-d402d",
    storageBucket: "inventario-2025-d402d.firebasestorage.app",
    messagingSenderId: "833420400157",
    appId: "1:833420400157:web:75a5a3773636c12a9c98f4"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Agregar producto a Firebase
const addProductToInventory = async (event) => {
    event.preventDefault();
    const productName = document.getElementById('productName').value;
    const productQuantity = document.getElementById('productQuantity').value;
    const productPeso = document.getElementById('productPeso').value;

    if (productName && productQuantity) {
        try {
            await addDoc(collection(db, "inventory"), {
                name: productName,
                quantity: parseInt(productQuantity),
                peso: productPeso,
            });
            console.log("✅ Producto agregado con éxito.");
            document.getElementById('entryForm').reset();
            renderInventoryTable();
        } catch (error) {
            console.error("❌ Error al agregar el producto:", error);
        }
    } else {
        console.error("❌ Todos los campos son obligatorios.");
    }
};

// Renderizar inventario
const renderInventoryTable = async () => {
    const inventoryTable = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0];
    inventoryTable.innerHTML = '';

    try {
        const querySnapshot = await getDocs(collection(db, "inventory"));
        querySnapshot.forEach((docSnap) => {
            const product = docSnap.data();
            const row = inventoryTable.insertRow();
            row.insertCell(0).textContent = product.name;
            row.insertCell(1).textContent = product.quantity;
            row.insertCell(2).textContent = product.peso;

            
            const actionsCell = row.insertCell(3);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', () => deleteProduct(docSnap.id));
            actionsCell.appendChild(deleteButton);
        });
    } catch (error) {
        console.error("❌ Error al cargar el inventario:", error);
    }
};

// Eliminar producto
const deleteProduct = async (id) => {
    try {
        await deleteDoc(doc(db, "inventory", id));
        console.log("✅ Producto eliminado con éxito.");
        renderInventoryTable();
    } catch (error) {
        console.error("❌ Error al eliminar el producto:", error);
    }
};

// Eventos
document.getElementById('entryForm').addEventListener('submit', addProductToInventory);
window.addEventListener('load', renderInventoryTable);
