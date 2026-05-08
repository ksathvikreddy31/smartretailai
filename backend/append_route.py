
import os

path = r'c:\Users\ksath\OneDrive\Desktop\smartretailsystem\backend\app\routes\retail_routes.py'
with open(path, 'r') as f:
    content = f.read()

new_route = """
@router.delete("/restock/{request_id}")
def delete_restock_request(request_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    try:
        request = db.query(models.RestockRequest).filter(
            models.RestockRequest.id == request_id,
            models.RestockRequest.retailer_id == current_user.get("id")
        ).first()
        if not request:
            raise HTTPException(status_code=404, detail="Request not found")
        db.delete(request)
        db.commit()
        return {"message": "Deleted"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
"""

if "@router.delete(\"/restock/{request_id}\")" not in content:
    with open(path, 'a') as f:
        f.write(new_route)
    print("Successfully appended the delete route.")
else:
    print("Delete route already exists.")
