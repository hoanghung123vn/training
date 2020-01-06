//#include<iostream>
//#include<algorithm>
//using namespace std;
//
//int gcd(int a, int b) {
//	if (b == 0) return a;
//	return gcd(b, a % b);
//}
//
//int pour(int fromCap, int toCap, int c) { // đổ nước từ bình fromCap sang bình toCap.
//	//khởi tạo lượng nước ban đầu ở 2 bình: bình fromCap chứa from lít, bình toCap chứa 0 lít.
//	int from = fromCap;
//	int to = 0;
//	//Bước 1: đổ đầy bình fromCap
//	int step = 1; 
//	//cout << "(" << fromCap << ", 0) ";
//	//Kết thúc khi 1 trong 2 bình chứa c lit
//	while (from != c && to != c) {
//		//Tính số lít nước tối đa có thể đổ từ bình fromCap sang bình toCap
//		int temp = min(from, toCap - to);
//		//Đổ temp lít nước từ fromCap sang toCap
//		to += temp;
//		from -= temp;
//		step++;
//		//cout << " ==> (" << from << ", " << to << ")";
//		if (from == c || to == c) break;
//		//Bước 2: Nếu fromCap rỗng, đổ đầy fromCap
//		if (from == 0) {
//			from = fromCap;
//			step++;
//			//cout << " ==> (" << from << ", " << to << ")";
//		}
//		//Bước 3: Nếu toCap đầy, làm rỗng nó
//		if (to == toCap) {
//			to = 0;
//			step++;
//			//cout << " ==> (" << from << ", " << to << ")";
//		}
//	}
//	return step;
//}
//
//int minStep(int a, int b, int c) {
//	if (b > a) swap(a, b);
//	if (c > a) return -1;
//	if ((c % gcd(a, b)) != 0) return -1;
//	return min(pour(a, b, c), pour(b, a, c));
//}
//
//int main() {
//	int n;
//	cin >> n;
//	int *m = new int[n];
//	for (int i = 0; i < n; i++) {
//		int a, b, c;
//		cin >> a >> b >> c;
//		m[i] = minStep(a, b, c);
//	}
//	for (int i = 0; i < n; i++) cout << m[i] << endl;
//	system("pause");
//	return 0;
//}
