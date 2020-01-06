//#include<iostream>
//using namespace std;
//
//void THN(int n, char a, char b, char c) {
//	if (n == 1) cout << "Chuyen dia tu " << a << " sang " << c << endl;
//	else {
//		THN(n - 1, a, b, c);
//		THN(1, a, c, b);
//		THN(n - 1, b, c, a);
//	}
//}
//
//int main() {
//	cout << "Nhap vao so dia: " << endl;
//	int n;
//	cin >> n;
//	THN(n, 'A', 'B', 'C');
//	system("pause");
//	return 0;
//}