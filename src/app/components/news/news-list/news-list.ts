import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { News, NewsCategory } from '../../../models/news.interface';
import { Footer } from '../../shared/footer/footer';
import { Header } from '../../shared/header/header';

@Component({
  selector: 'app-news-list',
  imports: [CommonModule, RouterModule, FormsModule, Footer, Header],
  templateUrl: './news-list.html',
  styleUrl: './news-list.css'
})
export class NewsList {
  selectedCategory = 'all';
  
  categories: NewsCategory[] = [
    { id: 'all', ten: 'Tất cả', moTa: 'Tất cả tin tức', thuTu: 0 },
    { id: 'tai-chinh', ten: 'Tài chính', moTa: 'Tin tức về tài chính', thuTu: 1 },
    { id: 'vay-von', ten: 'Vay vốn', moTa: 'Tin tức về vay vốn', thuTu: 2 },
    { id: 'dau-tu', ten: 'Đầu tư', moTa: 'Tin tức về đầu tư', thuTu: 3 },
    { id: 'kinh-doanh', ten: 'Kinh doanh', moTa: 'Tin tức về kinh doanh', thuTu: 4 },
    { id: 'chinh-sach', ten: 'Chính sách', moTa: 'Chính sách mới', thuTu: 5 }
  ];

  newsList: News[] = [
    {
      id: 'news-001',
      tieuDe: 'Lãi suất vay ngân hàng tháng 12/2024: Xu hướng giảm mạnh',
      tomTat: 'Các ngân hàng liên tục điều chỉnh giảm lãi suất cho vay để hỗ trợ doanh nghiệp và cá nhân tiếp cận vốn dễ dàng hơn trong bối cảnh kinh tế phục hồi.',
      noiDung: `Theo khảo sát mới nhất, hầu hết các ngân hàng thương mại đã điều chỉnh giảm lãi suất cho vay từ 0.2% đến 0.5% so với tháng trước. Điều này thể hiện nỗ lực của hệ thống ngân hàng trong việc hỗ trợ doanh nghiệp và cá nhân tiếp cận nguồn vốn.

Cụ thể, lãi suất cho vay ngắn hạn hiện dao động từ 4.5% - 6.5%/năm, trong khi lãi suất cho vay trung và dài hạn được duy trì ở mức 6% - 8.5%/năm. Các ngân hàng cũng đưa ra nhiều chương trình ưu đãi đặc biệt cho khách hàng SME và cá nhân có nhu cầu vay mua nhà, xe.

Dự báo trong những tháng cuối năm, lãi suất sẽ tiếp tục được điều chỉnh theo hướng tích cực để thúc đẩy tăng trưởng kinh tế.`,
      anhDaiDien: '/assets/images/news/lai-suat-giam.jpg',
      tacGia: 'Nguyễn Văn A',
      ngayDang: new Date('2024-12-01'),
      luotXem: 1250,
      danhMuc: 'tai-chinh',
      tags: ['lãi suất', 'ngân hàng', 'vay vốn'],
      trangThai: 'published'
    },
    {
      id: 'news-002', 
      tieuDe: 'Hướng dẫn vay vốn kinh doanh cho doanh nghiệp nhỏ và vừa',
      tomTat: 'Cẩm nang chi tiết về quy trình, thủ tục và điều kiện vay vốn kinh doanh dành cho các doanh nghiệp SME, giúp chủ doanh nghiệp chuẩn bị hồ sơ hiệu quả.',
      noiDung: `Vay vốn kinh doanh là một trong những giải pháp tài chính quan trọng giúp doanh nghiệp nhỏ và vừa (SME) mở rộng quy mô hoạt động. Tuy nhiên, để tiếp cận được nguồn vốn này, doanh nghiệp cần chuẩn bị kỹ lưỡng về hồ sơ và hiểu rõ quy trình.

**Điều kiện cơ bản:**
- Doanh nghiệp hoạt động tối thiểu 6 tháng
- Có doanh thu ổn định
- Không nợ quá hạn với các tổ chức tín dụng
- Mục đích vay rõ ràng và khả thi

**Hồ sơ cần chuẩn bị:**
- Giấy phép kinh doanh hợp lệ
- Báo cáo tài chính 6-12 tháng gần nhất
- Sao kê tài khoản ngân hàng
- Hợp đồng cho thuê mặt bằng
- Kế hoạch sử dụng vốn chi tiết

**Quy trình vay:**
1. Nộp hồ sơ và đăng ký vay
2. Thẩm định hồ sơ (3-7 ngày)
3. Khảo sát thực địa (nếu cần)
4. Phê duyệt và ký hợp đồng
5. Giải ngân theo kế hoạch

Với sự chuẩn bị kỹ lưỡng, doanh nghiệp có thể rút ngắn thời gian xử lý hồ sơ và tăng khả năng được duyệt vay.`,
      anhDaiDien: '/assets/images/news/vay-von-doanh-nghiep.jpg',
      tacGia: 'Trần Thị B',
      ngayDang: new Date('2024-11-28'),
      luotXem: 892,
      danhMuc: 'vay-von',
      tags: ['vay vốn', 'doanh nghiệp', 'SME'],
      trangThai: 'published'
    },
    {
      id: 'news-003',
      tieuDe: 'Top 5 kênh đầu tư sinh lời tốt nhất năm 2024',
      tomTat: 'Phân tích và đánh giá các kênh đầu tư mang lại hiệu quả cao trong năm 2024, từ bất động sản, chứng khoán đến các hình thức đầu tư mới.',
      noiDung: `Năm 2024 được đánh giá là năm đầy biến động nhưng cũng chứa đựng nhiều cơ hội đầu tư hấp dẫn. Dưới đây là 5 kênh đầu tư được chuyên gia đánh giá cao:

**1. Bất động sản**
Thị trường bất động sản cho thuê vẫn là kênh đầu tư ổn định với mức sinh lời 8-12%/năm. Đặc biệt các khu vực gần trung tâm và có hạ tầng phát triển.

**2. Chứng khoán**
Thị trường chứng khoán Việt Nam có nhiều cơ hội với các cổ phiếu có tiềm năng tăng trưởng mạnh, đặc biệt trong lĩnh vực công nghệ và tiêu dùng.

**3. Trái phiếu doanh nghiệp**
Với lãi suất ổn định từ 7-10%/năm, trái phiếu doanh nghiệp là lựa chọn an toàn cho nhà đầu tư thận trọng.

**4. Vàng**
Vàng vẫn là kênh đầu tư truyền thống được ưa chuộng, đặc biệt trong bối cảnh kinh tế không ổn định.

**5. Cryptocurrency**
Dù có rủi ro cao nhưng các đồng tiền số vẫn mang lại cơ hội sinh lời lớn cho những nhà đầu tư am hiểu thị trường.

Chuyên gia khuyến nghị nên đa dạng hóa danh mục đầu tư để tối ưu hóa lợi nhuận và giảm thiểu rủi ro.`,
      anhDaiDien: '/assets/images/news/kenh-dau-tu-2024.jpg',
      tacGia: 'Lê Văn C',
      ngayDang: new Date('2024-11-25'),
      luotXem: 1567,
      danhMuc: 'dau-tu',
      tags: ['đầu tư', 'sinh lời', 'bất động sản', 'chứng khoán'],
      trangThai: 'published'
    },
    {
      id: 'news-004',
      tieuDe: 'Startup Fintech Việt Nam: Cơ hội và thách thức',
      tomTat: 'Phân tích tình hình phát triển của các startup fintech tại Việt Nam, những cơ hội đầu tư hấp dẫn và các thách thức cần vượt qua.',
      noiDung: `Việt Nam đang chứng kiến sự bùng nổ của các startup fintech với hơn 150 công ty hoạt động trong lĩnh vực này. Đây được coi là một trong những thị trường fintech phát triển nhanh nhất Đông Nam Á.

**Cơ hội phát triển:**
- Thị trường tiềm năng lớn với 97 triệu dân
- Tỷ lệ sử dụng dịch vụ ngân hàng vẫn thấp
- Chính phủ ủng hộ chuyển đổi số
- Infrastrucure công nghệ ngày càng hoàn thiện

**Các lĩnh vực nổi bật:**
1. Thanh toán điện tử (e-wallet)
2. Cho vay P2P
3. Quản lý tài chính cá nhân
4. Bảo hiểm số (insurtech)
5. Dịch vụ ngân hàng số

**Thách thức cần vượt qua:**
- Quy định pháp lý chưa hoàn thiện
- Cạnh tranh gay gắt
- Vấn đề bảo mật thông tin
- Khó khăn trong việc gọi vốn

Dự báo trong 2-3 năm tới, thị trường fintech Việt Nam sẽ có sự tăng trưởng mạnh mẽ với tổng giá trị giao dịch có thể đạt 25 tỷ USD.`,
      anhDaiDien: '/assets/images/news/fintech-vietnam.jpg',
      tacGia: 'Phạm Thị D',
      ngayDang: new Date('2024-11-22'),
      luotXem: 743,
      danhMuc: 'kinh-doanh',
      tags: ['startup', 'fintech', 'công nghệ tài chính'],
      trangThai: 'published'
    },
    {
      id: 'news-005',
      tieuDe: 'Chính sách hỗ trợ doanh nghiệp vay vốn ưu đãi 2024',
      tomTat: 'Tổng hợp các chính sách mới của Chính phủ nhằm hỗ trợ doanh nghiệp tiếp cận vốn với lãi suất ưu đãi, đặc biệt cho SME và startup.',
      noiDung: `Chính phủ vừa ban hành nhiều chính sách mới nhằm hỗ trợ doanh nghiệp tiếp cận nguồn vốn với điều kiện ưu đãi, góp phần thúc đẩy phát triển kinh tế.

**Những chính sách nổi bật:**

1. **Gói hỗ trợ 50.000 tỷ đồng**
- Lãi suất ưu đãi 4-6%/năm
- Dành cho SME và startup công nghệ
- Thời hạn vay lên đến 10 năm

2. **Chương trình bảo lãnh tín dụng**
- Nhà nước bảo lãnh đến 85% giá trị khoản vay
- Giảm yêu cầu tài sản đảm bảo
- Rút ngắn thời gian thẩm định

3. **Ưu đãi cho doanh nghiệp xanh**
- Lãi suất giảm 0.5% cho dự án môi trường
- Hỗ trợ 100% phí thẩm định
- Ưu tiên xét duyệt nhanh

**Điều kiện hưởng ưu đãi:**
- Doanh nghiệp thuộc lĩnh vực ưu tiên
- Có phương án kinh doanh khả thi
- Cam kết tạo việc làm
- Tuân thủ các quy định về môi trường

**Quy trình đăng ký:**
1. Đăng ký trực tuyến qua cổng dịch vụ công
2. Nộp hồ sơ tại ngân hàng đối tác
3. Thẩm định và phê duyệt (7-15 ngày)
4. Ký hợp đồng và giải ngân

Các chính sách này dự kiến sẽ giúp hàng ngàn doanh nghiệp tiếp cận được nguồn vốn cần thiết để phát triển.`,
      anhDaiDien: '/assets/images/news/chinh-sach-ho-tro.jpg',
      tacGia: 'Hoàng Văn E',
      ngayDang: new Date('2024-11-20'),
      luotXem: 923,
      danhMuc: 'chinh-sach',
      tags: ['chính sách', 'hỗ trợ', 'doanh nghiệp', 'vay ưu đãi'],
      trangThai: 'published'
    },
    {
      id: 'news-006',
      tieuDe: 'Cách tính lãi suất vay và các khoản phí cần biết',
      tomTat: 'Hướng dẫn chi tiết cách tính lãi suất vay, các loại phí phát sinh và mẹo tiết kiệm chi phí khi vay vốn ngân hàng.',
      noiDung: `Hiểu rõ cách tính lãi suất và các khoản phí là điều cần thiết giúp bạn có quyết định vay vốn thông minh và tiết kiệm chi phí.

**Các phương pháp tính lãi:**

1. **Lãi suất cố định**
- Không thay đổi trong suốt thời gian vay
- Dễ dự tính chi phí
- Thường cao hơn lãi suất thả nổi

2. **Lãi suất thả nổi**
- Thay đổi theo thị trường
- Ban đầu thường thấp hơn
- Có rủi ro tăng trong tương lai

**Công thức tính lãi:**
- Lãi hàng tháng = Dư nợ × Lãi suất tháng
- Gốc hàng tháng = Số tiền vay / Số tháng vay
- Tổng thanh toán = Gốc + Lãi

**Các khoản phí phổ biến:**
- Phí thẩm định hồ sơ: 0.5-1% số tiền vay
- Phí quản lý tài khoản: 50-200k/tháng
- Phí bảo hiểm: 0.3-0.5%/năm
- Phí thanh lý hợp đồng sớm: 1-3%

**Mẹo tiết kiệm:**
1. So sánh lãi suất từ nhiều ngân hàng
2. Đàm phán miễn giảm phí
3. Trả nợ trước hạn nếu có khả năng
4. Chọn gói vay phù hợp với thu nhập
5. Duy trì tín dụng tốt

Hãy luôn đọc kỹ hợp đồng và hỏi rõ tất cả các khoản phí trước khi ký.`,
      anhDaiDien: '/assets/images/news/tinh-lai-suat.jpg',
      tacGia: 'Nguyễn Thị F',
      ngayDang: new Date('2024-11-18'),
      luotXem: 634,
      danhMuc: 'tai-chinh',
      tags: ['lãi suất', 'tính toán', 'phí vay', 'ngân hàng'],
      trangThai: 'published'
    }
  ];

  get filteredNews(): News[] {
    if (this.selectedCategory === 'all') {
      return this.newsList;
    }
    return this.newsList.filter(news => news.danhMuc === this.selectedCategory);
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  formatShortDate(date: Date): string {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  formatViewCount(count: number): string {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.ten : 'Khác';
  }

  getCategoryCount(categoryId: string): number {
    return this.newsList.filter(news => news.danhMuc === categoryId).length;
  }
}
