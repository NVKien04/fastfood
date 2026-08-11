'use client';

import * as React from 'react';
import { ApiMain } from '@/services/apis/main/api.main';
import { ProductDetailResponseDto, ProductFilterDto } from '@/services/apis/main/generated/data-contracts';
import { PaginationMeta } from '@/services/apis/api.type';
import { ProductDetailModal, formatVND } from './ProductDetailModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Utensils, ChevronLeft, ChevronRight, Search, Loader2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const ProductList: React.FC = () => {
  const [products, setProducts] = React.useState<ProductDetailResponseDto[]>([]);
  const [pagination, setPagination] = React.useState<PaginationMeta | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // Filter State
  const [page, setPage] = React.useState<number>(1);
  const [limit] = React.useState<number>(8);
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  // Selected Detail Modal State
  const [selectedProduct, setSelectedProduct] = React.useState<ProductDetailResponseDto | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [detailLoading, setDetailLoading] = React.useState<boolean>(false);

  // Fetch product list
  const fetchProducts = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    const filter: ProductFilterDto = {
      page,
      limit,
    };

    const response = await ApiMain.instance.product.getProducts(filter);

    if (response.kind === 'OK') {
      setProducts(response.data || []);
      setPagination(response.pagination || null);
    } else {
      setError(response.error || 'Khởi tạo danh sách sản phẩm thất bại');
    }
    setLoading(false);
  }, [page, limit]);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Client-side search filtering (if needed)
  const filteredProducts = React.useMemo(() => {
    if (!searchQuery.trim()) return products;
    return products.filter((p) => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);

  // Open modal with detail
  const handleOpenDetail = async (product: ProductDetailResponseDto) => {
    setDetailLoading(true);
    // Fetch full detail (including variants & ingredients)
    const res = await ApiMain.instance.product.getById(product.id);

    console.log(res);

    if (res.kind === 'OK' && res.data) {
      setSelectedProduct(res.data);
    } else {
      // Fallback to item
      setSelectedProduct(product);
    }
    setDetailLoading(false);
    setIsModalOpen(true);
  };

  const handleAddToCartFromModal = (item: {
    product: ProductDetailResponseDto;
    quantity: number;
    totalPrice: number;
  }) => {
    // Demo toast or notification for add to cart
    alert(`Đã thêm ${item.quantity}x ${item.product.name} vào giỏ hàng (${formatVND(item.totalPrice)})!`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>Thực Đơn Món Ăn</span>
            <span className="text-red-600">🍕</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Khám phá hương vị tuyệt hảo từ nguyên liệu tươi ngon nhất</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm món ăn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500/20 bg-white"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          <p className="text-sm font-medium">Đang tải danh sách món ăn...</p>
        </div>
      ) : error ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center p-6 bg-red-50 rounded-2xl border border-red-100 text-center">
          <p className="text-red-600 font-semibold mb-3">{error}</p>
          <Button onClick={fetchProducts} variant="outline" className="border-red-200 text-red-600 hover:bg-red-100">
            Thử lại
          </Button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-2xl border border-gray-100">
          <Utensils className="w-12 h-12 text-gray-300 mb-3" />
          <p className="text-gray-600 font-medium">Không tìm thấy món ăn nào phù hợp</p>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
              >
                <div>
                  {/* Image Placeholder Container (Temporarily no product image) */}
                  <div className="relative w-full aspect-square bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 flex flex-col items-center justify-center p-6 border-b border-gray-50 group-hover:from-orange-100 group-hover:to-red-100 transition-colors">
                    <div className="w-28 h-28 rounded-full bg-white/90 shadow-sm border border-orange-100 flex flex-col items-center justify-center gap-1.5 p-3 text-center transition-transform group-hover:scale-105">
                      <Utensils className="w-8 h-8 text-red-500/80" />
                      <span className="text-[10px] font-medium text-gray-400 leading-tight">Chưa có ảnh</span>
                    </div>

                    {product.isFeatured === 1 && (
                      <Badge className="absolute top-3 left-3 bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 shadow-sm">
                        Nổi bật
                      </Badge>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg leading-snug line-clamp-1 group-hover:text-red-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed min-h-[36px]">
                      {product.description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}
                    </p>
                  </div>
                </div>

                {/* Footer: Price & Action */}
                <div className="p-5 pt-0 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 block uppercase tracking-wider">
                      Giá từ
                    </span>
                    <span className="text-lg font-black text-gray-900">{formatVND(product.basePrice || 0)}</span>
                  </div>

                  <Button
                    onClick={() => handleOpenDetail(product)}
                    disabled={detailLoading}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-2 text-xs font-bold shadow-md shadow-red-600/20 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <span>Chọn món</span>
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Component */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-6 flex-wrap gap-4">
              <span className="text-sm text-gray-500 font-medium">
                Hiển thị trang <strong className="text-gray-900">{pagination.currentPage}</strong> /{' '}
                <strong className="text-gray-900">{pagination.totalPages}</strong> (Tổng {pagination.totalItems} sản
                phẩm)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Trang trước</span>
                </Button>

                <div className="flex items-center gap-1 px-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        pageNum === page
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page >= pagination.totalPages}
                  className="rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold gap-1"
                >
                  <span>Trang sau</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCartFromModal}
      />
    </div>
  );
};
