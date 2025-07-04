// import React, { useState, useMemo } from 'react';

// const ITEMS_PER_PAGE = 15;

// const MenuSection = ({
//                          categories,
//                          selectedCategory,
//                          setSelectedCategory,
//                          searchKeyword,
//                          setSearchKeyword,
//                          menuGroupedByCategory,
//                          orderItems,
//                          setOrderItems,
//                      }) => {
//     const [currentPage, setCurrentPage] = useState(1);

//     const filteredItems = useMemo(() => {
//         let items = [];

//         const entries = Object.entries(menuGroupedByCategory).filter(
//             ([category]) => selectedCategory === 'Tất cả' || category === selectedCategory
//         );

//         for (const [_, itemsInCategory] of entries) {
//             items.push(
//                 ...itemsInCategory.filter(
//                     (item) =>
//                         (item.active !== false && item.active !== 'false') &&
//                         item.name.toLowerCase().includes(searchKeyword.toLowerCase())
//                 )
//             );
//         }

//         return items;
//     }, [menuGroupedByCategory, selectedCategory, searchKeyword]);

//     const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
//     const paginatedItems = filteredItems.slice(
//         (currentPage - 1) * ITEMS_PER_PAGE,
//         currentPage * ITEMS_PER_PAGE
//     );

//     const handleAddToOrder = (item) => {
//         setOrderItems((prev) => {
//             const unsentUnreadyItems = prev.filter(
//                 (oi) => oi.food_id === item.id && !oi.is_sent && !oi.is_ready
//             );

//             if (unsentUnreadyItems.length > 0) {
//                 const existing = unsentUnreadyItems[0];
//                 return prev.map((oi) =>
//                     oi === existing ? { ...oi, quantity: oi.quantity + 1 } : oi
//                 );
//             }

//             return [
//                 ...prev,
//                 {
//                     id: `temp-${Date.now()}-${Math.random()}`,
//                     food_id: item.id,
//                     name: item.name,
//                     price: item.price,
//                     quantity: 1,
//                     is_sent: false,
//                     is_ready: false,
//                 },
//             ];
//         });
//     };

//     return (
//         <>
//             {/* ---- Category Buttons ---- */}
//             <div style={{ margin: '12px 0', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
//                 <button
//                     onClick={() => {
//                         setSelectedCategory('Tất cả');
//                         setCurrentPage(1);
//                     }}
//                     style={{
//                         padding: '6px 12px',
//                         backgroundColor: selectedCategory === 'Tất cả' ? '#556B2F' : '#eee',
//                         color: selectedCategory === 'Tất cả' ? 'white' : 'black',
//                         border: 'none',
//                         borderRadius: '6px',
//                         cursor: 'pointer',
//                     }}
//                 >
//                     Tất cả
//                 </button>
//                 {categories.map((cat) => (
//                     <button
//                         key={cat.id}
//                         onClick={() => {
//                             setSelectedCategory(cat.name);
//                             setCurrentPage(1);
//                         }}
//                         style={{
//                             padding: '6px 12px',
//                             backgroundColor: selectedCategory === cat.name ? '#556B2F' : '#eee',
//                             color: selectedCategory === cat.name ? 'white' : 'black',
//                             border: 'none',
//                             borderRadius: '6px',
//                             cursor: 'pointer',
//                         }}
//                     >
//                         {cat.name}
//                     </button>
//                 ))}
//             </div>

//             {/* ---- Search ---- */}
//             <div style={{ margin: '12px 0' }}>
//                 <input
//                     type="text"
//                     placeholder="Tìm món ăn..."
//                     value={searchKeyword}
//                     onChange={(e) => {
//                         setSearchKeyword(e.target.value);
//                         setCurrentPage(1);
//                     }}
//                     style={{
//                         padding: '8px',
//                         width: '100%',
//                         maxWidth: '300px',
//                         borderRadius: '6px',
//                         border: '1px solid #ccc',
//                     }}
//                 />
//             </div>

//             {/* ---- Menu Items Grid ---- */}
//             <div className="menu-grid">
//                 {paginatedItems.map((item) => (
//                     <div
//                         key={item.id}
//                         className="menu-item"
//                         onClick={() => handleAddToOrder(item)}
//                     >
//                         {item.image_url && (
//                             <img
//                                 src={item.image_url}
//                                 alt={item.name}
//                                 className="menu-item-img"
//                             />
//                         )}
//                         <div className="menu-item-name">{item.name}</div>
//                     </div>
//                 ))}
//             </div>

//             {/* ---- Pagination ---- */}
//             {totalPages > 1 && (
//                 <div style={{ marginTop: '16px', textAlign: 'center' }}>
//                     {[...Array(totalPages)].map((_, index) => (
//                         <button
//                             key={index}
//                             onClick={() => setCurrentPage(index + 1)}
//                             className={`pagination-btn ${
//                                 currentPage === index + 1 ? 'active' : ''
//                             }`}
//                         >
//                             {index + 1}
//                         </button>
//                     ))}
//                 </div>
//             )}

//             {/* ---- CSS ---- */}
//             <style>{`
//                 .menu-grid {
//                     display: flex;
//                     flex-wrap: wrap;
//                     gap: 12px;
//                 }

//                 .menu-item {
//                     border: 1px solid #ddd;
//                     border-radius: 6px;
//                     padding: 8px;
//                     flex: 1 1 calc(20% - 12px);
//                     max-width: calc(20% - 12px);
//                     box-sizing: border-box;
//                     text-align: center;
//                     cursor: pointer;
//                     transition: box-shadow 0.2s ease;
//                     background-color: #fff;
//                     display: flex;
//                     flex-direction: column;
//                     align-items: center;
//                 }

//                 .menu-item:hover {
//                     box-shadow: 0 0 6px rgba(0,0,0,0.1);
//                 }

//                 .menu-item-img {
//                     width: 100%;
//                     aspect-ratio: 1/1;
//                     object-fit: cover;
//                     border-radius: 6px;
//                     margin-bottom: 8px;
//                 }

//                 .menu-item-name {
//                     font-weight: bold;
//                     font-size: 0.9em;
//                     line-height: 1.3;
//                 }

//                 .pagination-btn {
//                     padding: 6px 12px;
//                     margin: 0 4px;
//                     border-radius: 6px;
//                     border: 1px solid #ccc;
//                     background-color: white;
//                     color: black;
//                     cursor: pointer;
//                 }

//                 .pagination-btn.active {
//                     background-color: #556B2F;
//                     color: white;
//                     font-weight: bold;
//                     border-color: #556B2F;
//                 }

//                 @media (max-width: 1024px) {
//                     .menu-item {
//                         flex: 1 1 calc(33.33% - 12px);
//                         max-width: calc(33.33% - 12px);
//                     }
//                 }

//                 @media (max-width: 768px) {
//                     .menu-item {
//                         flex: 1 1 calc(50% - 12px);
//                         max-width: calc(50% - 12px);
//                     }
//                 }
//             `}</style>
//         </>
//     );
// };

// export default MenuSection;
import React, { useState, useMemo } from 'react';

const ITEMS_PER_PAGE = 15;

const MenuSection = ({
    categories,
    selectedCategory,
    setSelectedCategory,
    searchKeyword,
    setSearchKeyword,
    menuGroupedByCategory,
    orderItems,
    setOrderItems,
}) => {
    const [currentPage, setCurrentPage] = useState(1);

    const filteredItems = useMemo(() => {
        let items = [];
        const entries = Object.entries(menuGroupedByCategory).filter(
            ([category]) => selectedCategory === 'Tất cả' || category === selectedCategory
        );

        for (const [_, itemsInCategory] of entries) {
            items.push(
                ...itemsInCategory.filter(
                    (item) =>
                        (item.active !== false && item.active !== 'false') &&
                        item.name.toLowerCase().includes(searchKeyword.toLowerCase())
                )
            );
        }

        return items;
    }, [menuGroupedByCategory, selectedCategory, searchKeyword]);

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleAddToOrder = (item) => {
        setOrderItems((prev) => {
            const unsentUnreadyItems = prev.filter(
                (oi) => oi.food_id === item.id && !oi.is_sent && !oi.is_ready
            );

            if (unsentUnreadyItems.length > 0) {
                const existing = unsentUnreadyItems[0];
                return prev.map((oi) =>
                    oi === existing ? { ...oi, quantity: oi.quantity + 1 } : oi
                );
            }

            return [
                ...prev,
                {
                    id: `temp-${Date.now()}-${Math.random()}`,
                    food_id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: 1,
                    is_sent: false,
                    is_ready: false,
                },
            ];
        });
    };

    return (
        <>
            {/* ---- Category Buttons ---- */}
            <div style={{ margin: '12px 0', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {['Tất cả', ...categories.map((c) => c.name)].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => {
                            setSelectedCategory(cat);
                            setCurrentPage(1);
                        }}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: selectedCategory === cat ? '#1a1a1a' : '#fffef9',
                            color: selectedCategory === cat ? '#f5d76e' : '#1a1a1a',
                            border: '1px solid #d1b36a',
                            borderRadius: '8px',
                            fontFamily: 'Segoe UI, sans-serif',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '500',
                            transition: 'all 0.3s ease',
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* ---- Search ---- */}
            <div style={{ margin: '12px 0' }}>
                <input
                    type="text"
                    placeholder="Tìm món ăn..."
                    value={searchKeyword}
                    onChange={(e) => {
                        setSearchKeyword(e.target.value);
                        setCurrentPage(1);
                    }}
                    style={{
                        padding: '10px 16px',
                        width: '100%',
                        maxWidth: '320px',
                        borderRadius: '8px',
                        border: '1px solid #d1b36a',
                        fontFamily: 'Segoe UI, sans-serif',
                        fontSize: '15px',
                        backgroundColor: '#fffef9',
                        color: '#1a1a1a',
                        outline: 'none',
                    }}
                />
            </div>

            {/* ---- Menu Grid ---- */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
            }}>
                {paginatedItems.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => handleAddToOrder(item)}
                        style={{
                            border: '1px solid #e0c97f',
                            borderRadius: '10px',
                            padding: '12px',
                            width: 'calc(20% - 12px)',
                            backgroundColor: '#fff',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            transition: 'transform 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {item.image_url && (
                            <img
                                src={item.image_url}
                                alt={item.name}
                                style={{
                                    width: '100%',
                                    borderRadius: '8px',
                                    aspectRatio: '1 / 1',
                                    objectFit: 'cover',
                                    marginBottom: '8px',
                                }}
                            />
                        )}
                        <div style={{
                            fontWeight: '600',
                            fontSize: '0.95em',
                            color: '#1a1a1a',
                            textAlign: 'center',
                        }}>{item.name}</div>
                    </div>
                ))}
            </div>

            {/* ---- Pagination ---- */}
            {totalPages > 1 && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            style={{
                                padding: '6px 12px',
                                margin: '0 4px',
                                borderRadius: '6px',
                                border: '1px solid #ccc',
                                backgroundColor: currentPage === index + 1 ? '#1a1a1a' : '#fff',
                                color: currentPage === index + 1 ? '#f5d76e' : '#1a1a1a',
                                fontWeight: currentPage === index + 1 ? 'bold' : 'normal',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}
        </>
    );
};

export default MenuSection;
