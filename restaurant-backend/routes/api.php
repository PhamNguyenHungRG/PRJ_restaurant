<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TableController;
use App\Http\Controllers\FoodController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderDetailController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CashierController;

Route::get('/dashboard-data', [DashboardController::class, 'dashboardData']);
Route::prefix('dashboard')->group(function () {
    // Food
    Route::get('/foods', [DashboardController::class, 'getFoods']);
    Route::post('/foods', [DashboardController::class, 'createFood']);
    Route::put('/dashboard/foods/{id}', [DashboardController::class, 'updateFood']);
    Route::patch('/foods/{id}/toggle', [DashboardController::class, 'toggleFoodStatus']);

    // Category
    Route::get('/categories', [DashboardController::class, 'getCategories']);
    Route::post('/categories', [DashboardController::class, 'createCategory']);
    Route::post('/categories/{id}', [DashboardController::class, 'updateCategory']);
    Route::patch('/categories/{id}/toggle', [DashboardController::class, 'toggleCategoryStatus']);

    // User (Employee)
    Route::get('/users', [DashboardController::class, 'getUsers']);
    Route::post('/users', [DashboardController::class, 'createUser']);
    Route::post('/users/{id}', [DashboardController::class, 'updateUser']);
    Route::patch('/users/{id}/toggle', [DashboardController::class, 'toggleUserStatus']);
    Route::get('/dashboard/roles', function () {
        return \App\Models\Role::all();
    });

});


Route::put('orders/change-table', [OrderController::class, 'changeTable']);
Route::get('/tables/available', [TableController::class, 'getAvailableTables']);

Route::patch('/order-details/{id}/kitchen-status', [OrderDetailController::class, 'updateStatus']);
Route::get('/tables/{id}', [TableController::class, 'show']);
Route::get('/orders/latest/{tableId}', [OrderController::class, 'latestOrder']);
Route::get('/orders/pending', [OrderDetailController::class, 'getPendingOrders']);
Route::post('/orders/complete/{id}', [OrderDetailController::class, 'completeItem']);
Route::patch('/order-details/{id}/toggle-served', [OrderDetailController::class, 'toggleServed']);
Route::get('/orders/latest/{table_id}', [OrderController::class, 'getLatestByTable']);
Route::get('/orders', [OrderController::class, 'getOrdersByTable']);
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/foods/category-name/{categoryName}', [FoodController::class, 'getFoodsByCategoryName']);
Route::get('/foods', [FoodController::class, 'index']);
Route::get('/tables', [TableController::class, 'index']);
Route::put('/tables/{id}', [TableController::class, 'update']); // thêm route update
Route::get('/orders/by-table', [OrderController::class, 'getOrdersByTable']);
Route::get('/orders/by-table/{table_id}', [OrderController::class, 'showByTable']);
Route::post('/orders/update-table-status/{tableId}', [OrderController::class, 'updateTableStatusBasedOnOrder']);
Route::patch('/order-details/{id}/accept', [OrderDetailController::class, 'accept']);
Route::get('/orders/{id}/details', [OrderDetailController::class, 'getOrderDetailsByOrderId']);
// Route::patch('/order-details/{id}/start-cooking', [OrderDetailController::class, 'startCooking']);
Route::post('/orders/startcooking/{id}', [OrderDetailController::class, 'startCooking']);
Route::delete('/order-details/{id}', [OrderDetailController::class, 'destroy']);
Route::get('/order-details/pending-ready', [OrderDetailController::class, 'getPendingReady']);
Route::post('/login', [AuthController::class, 'login']);

// Bill routes

Route::prefix('cashier')->group(function () {
    Route::get('/orders', [CashierController::class, 'index']);             // Danh sách hóa đơn chưa thanh toán
    Route::get('/orders/{id}', [CashierController::class, 'show']);         // Lấy chi tiết hóa đơn
    Route::post('/orders/{id}/complete', [CashierController::class, 'complete']); // Hoàn tất thanh toán
});



