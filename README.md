# mi_bliblioteca_dashboard

# 📚 **Proyecto Web de Biblioteca**

## **🌟 Descripción**

Bienvenido al **Proyecto Web de Biblioteca**, una plataforma interactiva que permite a los usuarios explorar listas de libros, consultar detalles y realizar filtros personalizados. El contenido se obtiene desde la **API de libros del New York Times**, lo que garantiza datos actualizados y reales.

Esta aplicación ha sido construida **sin frameworks ni librerías externas**, usando solo **JavaScript Vanilla**, **HTML5** y **CSS3**, con enfoque en **diseño responsive**, **mobile-first** y una **estructura modularizada**.

---

## **🔗 API Utilizada: The New York Times Books API**

Este proyecto utiliza la [Books API de The New York Times](https://developer.nytimes.com/docs/books-product/1/overview), que proporciona acceso a las listas de libros más vendidos, actualizadas semanalmente.

### **¿Qué datos proporciona esta API?**
- Listas de libros organizadas por categorías.
- Información detallada de cada libro: título, autor, descripción, imagen, enlace de compra, etc.
- Fechas de publicación más antigua y más reciente en la lista.
- Número de semanas en la lista.
- Frecuencia de actualización de la lista (weekly/monthly).

### **Ejemplo de Endpoint utilizado:**

```http
GET https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=YOUR_API_KEY
