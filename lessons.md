# lessons.md — sonpiaz.com

Đọc file này trước khi deploy. Mỗi luật rút từ một lần hỏng thật, có ngày.


## 0. NGUYÊN NHÂN THẬT của cả hai lần revert ngày 12/09 (xác nhận 12:4x bằng dữ liệu)

Vercel project `sonpiaz` **đang nối Git với repo `sonpiaz/sonpiaz`**, repo chứa mã nguồn **site cũ** và README hồ sơ GitHub.
Mỗi lần push vào repo đó, Vercel tự deploy site cũ lên **production**. `cos-brand` đã push README ba lần trong ngày:

| Push vào `sonpiaz/sonpiaz` (PT) | Vercel tự deploy production (PT) | Hậu quả |
|---|---|---|
| 10:52:59 `21fdd32` | 10:53:12 | bị bản mới của Codex đè sau 3 phút, không ai thấy |
| 11:20:50 `1cc31ac` | 11:21:02 | **sự cố 1**, chỉ còn `/` sống |
| 12:16:45 `c4d3a76` | 12:17:56 | **sự cố 2**, site cũ "Blog - coming soon" |

Nguồn: `gh api repos/sonpiaz/sonpiaz/deployments?sha=<sha>`, `creator: vercel[bot]`, `environment: Production`.

**Chẩn đoán "0ms là hỏng" ở mục 1 là sai hai lần**: vừa sai tiêu chí, vừa đổ cho đúng thứ vô can. Thứ thật sự gây hỏng là một push
tưởng như vô hại vào **một repo khác**. Luật rút ra:

1. **Trước khi push vào bất cứ repo nào, kiểm repo đó có nối deploy không**: `gh api repos/<owner>/<repo>/deployments --jq '.[0]'`.
   Có `vercel[bot]` + `Production` là push = đăng production.
2. **Khi production đổi mà không ai chạy lệnh**, việc đầu tiên là liệt kê mọi push quanh thời điểm đó, ở **mọi** repo, không chỉ repo site.
3. **Cấm push vào `sonpiaz/sonpiaz` cho tới khi site mới đã nằm trong chính repo đó** (brief chuyển repo, 12/09).

## 1. Không bao giờ deploy mà không kiểm output trước, và production sau (12/09/2026)

**Chuyện đã xảy ra.** Lúc 11:20 PT một bản lên production với `Builds: . [0ms]`, nghĩa là Vercel **không
build gì cả**, chỉ phục vụ thư mục gốc. Kết quả: `sonpiaz.com/` còn 200, còn `/projects`, `/projects/kyma`,
`/about`, `/stack`, `/writing` **đều 404**. Site sống được đúng một trang trong khoảng 20 phút.
Không test nào đỏ, không ai báo; phát hiện ra vì Sơn gửi ảnh chụp một trang khác và tôi tình cờ curl lại.

**Tệ hơn:** tôi đã nhắn cho agent thi công rằng *"404 bạn thấy là browse của bạn chưa lên, không phải site:
tôi vừa curl ra 200"* — **tôi chưa curl**. Tôi khẳng định một sự kiện mình chưa đo, và suýt làm agent bỏ qua
một sự cố thật.

**Luật, không có ngoại lệ:**

1. **Trước khi deploy**: `find dist -name '*.html' | wc -l` phải bằng đúng số trang mong đợi (hiện tại **33**, gồm 23 project).
   Dưới số đó thì dừng, không deploy.
2. **Lệnh deploy luôn là hai bước**: `vercel build` rồi `vercel deploy --prebuilt --prod`.
   **Không bao giờ** `vercel deploy --prod` trần từ thư mục gốc: nó deploy thư mục thô, build 0 ms, mất hết route.
3. **Sau khi deploy, trong cùng một lượt**: curl lại **toàn bộ** đường dẫn, không chỉ `/`. Trang chủ sống
   không nói gì về các trang còn lại, vì đúng cái kiểu hỏng này chỉ giết các trang con.
4. ~~`vercel inspect` thấy `. [0ms]` là hỏng~~ **LUẬT NÀY SAI, gỡ 12/09 11:3x.** `site-build` (Codex) chỉ ra
   bản **tốt** `6gf2fg9ak` cũng hiện `. [0ms]`, và đọc mã nguồn CLI: con số đó là `readyStateAt - createdAt`,
   không kiểm file hay route. Với `vercel deploy --prebuilt`, build xảy ra ở máy nên Vercel luôn ghi 0 ms.
   Tôi đã suy ra nguyên nhân từ một triệu chứng mà bản tốt cũng có. **Tiêu chí đúng**: bản ứng viên có đúng
   33 HTML **và** `vercel curl <route> --deployment <url>` trả 200 cho toàn bộ route, trước khi promote.
   Nguyên nhân thật của sự cố 11:20 **vẫn chưa xác định**; ghi thẳng là chưa biết.
6. **Sau một lần `vercel rollback`, Vercel ngừng tự gán domain cho bản deploy mới.** Bản mới lên được nhưng
   `sonpiaz.com` vẫn trỏ bản cũ. Muốn đưa bản đã kiểm ra domain thì `vercel promote <url> --scope sonpiazs-projects --yes`.
5. **Lùi lại**: `vercel rollback <URL-bản-tốt-gần-nhất> --scope sonpiazs-projects --yes`. Mất 2 giây.
   URL bản tốt luôn nằm ở cột cuối của `~/cos/handoff/2026-09-12-SONPIAZ-SITE-LOG.md`.

## 2. Không khẳng định trạng thái production mà chưa đo (12/09/2026)

Cùng sự cố trên. Câu *"tôi vừa curl ra 200"* khi chưa curl là loại sai nguy hiểm nhất, vì nó **tắt** hệ thống
cảnh báo của người khác. Nếu chưa chạy lệnh thì viết "chưa đo", không viết một con số.

## 3. Một trang chủ sống không phải là một site sống

Mọi câu "đã deploy xong" phải kèm **số route đã kiểm**, không phải một ảnh chụp trang chủ.

## 4. Link thân bài và ảnh xem duyệt (12/09/2026)

- Link trong thân bài, Read about và All writing phải có gạch chân mờ ngay ở trạng thái nghỉ, offset 3px và màu chữ chính; hover làm gạch chân rõ hơn. Kiểm các nhóm link này riêng, không suy từ tiêu đề danh sách.
- Trần ảnh 1400px là **chiều rộng**, không phải cạnh dài nhất. Ảnh full-page cần giữ bản gốc trong full/; ảnh xem duyệt cắt viewport đầu trang ở nguyên chiều rộng. Không thu toàn bộ chiều dài trang thành ảnh hẹp khó đọc.

## 5. Hồ sơ project private và số trang (12/09/2026)

Sơn duyệt gộp 12 hồ sơ mới: tổng 23 project, 33 HTML. Nhãn Private lấy từ visibility, không suy từ status; links rỗng không tạo dấu phân cách thừa hoặc trường Updated trong dòng metadata. Kiểm cả 12 route mới và 23 project trong hai file llms trước khi gửi ứng viên.

## 6. Quyền deploy và sự cố ngày 12/09 lúc 12:15–12:19 PT

- Chỉ chạy deploy từ `/Users/sonpiaz/sonpiaz-site`. Không deploy từ thư mục build tách riêng; các thư mục đó không được chứa `.vercel`.
- site-build chỉ tải ứng viên khi được phép, báo can-duyet rồi dừng. **Chỉ cos-brand được promote hoặc rollback**, kể cả sau khi ứng viên được duyệt; quy định này thay mọi hướng dẫn promote trước đó.
- cos-brand đã mở lại: pull origin/main 61cf903, build từ gốc repo và tải ứng viên với --skip-domain. site-build vẫn không được promote hoặc rollback.
- Việc body trang chủ trước/sau giống nhau không chứng minh production đang đúng. Cần kiểm toàn bộ route và nội dung mong đợi; đối chiếu hash ứng viên chỉ chứng minh ứng viên khớp build.
- cos-brand tự sửa content theo luật chỉ đăng sự thật kiểm được và bỏ con số tiền; site-build không sửa content.

- Đính chính của cos-brand: psj7r08rs không do site-build tạo. Chưa xác định tác nhân; khả năng redeploy từ dashboard hoặc máy khác là giả thuyết của owner, không phải kết luận đã kiểm chứng.

## 7. Repo Git cũ có thể tự deploy

Sơn báo repo `sonpiaz/sonpiaz` đang nối Git với project production và push vào đó sẽ đưa site cũ lên. **Cấm push repo đó.** Trước mỗi push, kiểm remote đúng `sonpiaz/sonpiaz-site`. Nguyên nhân đã được cos-brand xác nhận bằng dữ liệu ở mục 0 phía trên.

## 8. Markdown cùng nguồn và guard chống lệch

Yêu cầu agent-readable-surface ngày 12/09 thay hướng dẫn cũ "không cần guard": HTML và Markdown phải sinh từ cùng collection, có guard CI chứng minh bắt được bản bị sửa lệch hoặc nguồn mới hơn build. Thử phá trong bản sao cách ly, không sửa gói bằng chứng đã giao.
