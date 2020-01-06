//#include<iostream>
//#include<algorithm>
//#include<fstream>
//using namespace std;
//
//int main() {
//	const int MAX_SIZE = 5;
//	int n;
//	cin >> n;
//	if (n <= MAX_SIZE) {
//		float *a = new float[n];
//		for (int i = 0; i < n; i++) cin >> a[i];
//		sort(a, a + n);
//		for (int i = 0; i < n; i++) cout << a[i] << " ";
//	}
//	else {
//		float data;
//		float b[MAX_SIZE];
//		for (int i = 0; i < MAX_SIZE; i++) cin >> b[i];
//		ofstream outfile;
//		outfile.open("output1.dat");
//		for (int i = MAX_SIZE; i <= n ; i++) {
//			cin >> data;
//			outfile << data << " ";
//			outfile.close();
//		}
//	}
//	system("pause");
//	return 0;
//}