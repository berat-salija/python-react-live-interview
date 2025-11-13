# Product Catalog – Live Coding Interview

**Run the project**

```bash
docker compose up --build
```

- **API** → `http://localhost:8000/api/products`
- **Table view** → `http://localhost:5173`
- **Infinite scroll** → `http://localhost:5173/scroll`

---

## Tasks

| #     | Task                                                                                                                                 |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **1** | Return the **category name** instead of `category_id` in the API. Update the table view to display it.                               |
| **2** | Add a `country_code` query parameter to filter inventory. Add a country selector in the table view.                                  |
| **3** | Add an `available` boolean to the API response based on inventory quantity for the selected country. Show a badge in the table view. |
| **4** | Enable search across relevant fields and tables. Re-add the search input in the table view.                                          |
| **5** | Implement infinite scroll in `frontend/src/ScrollView.tsx`.                                                                          |
| **6** | Review and optimize `backend/Dockerfile` for production.                                                                             |

---

## Where to start

- **Backend**: `backend/main.py` → `list_products`
- **Frontend**: `frontend/src/TableView.tsx`

---

**Good luck!**  
Feel free to ask clarifying questions.
