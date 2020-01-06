//#include<iostream>
//#include<algorithm>
//#include<fstream>
//using namespace std;
//const int MAX_N = 5 * 1e5;
////const int MAX_N = 5;
//int main() {
//	int n;
//	ios_base::sync_with_stdio(false);
//	cin.tie(0);
//	cin >> n;
//	if (n <= MAX_N) {
//		float *a = new float[n];
//		for (int i = 0; i < n; i++)
//			cin >> a[i];
//		sort(a, a + n);
//		for (int i = 0; i < n; i++)
//			printf("%.2f ", a[i]);
//	}
//	else {
//		float *a = new float[MAX_N];
//		for (int i = 0; i < MAX_N; i++)
//			cin >> a[i];
//		sort(a, a + MAX_N);
//		ofstream fout;
//		fout.open("result.dat", ios::out);
//		for (int i = 0; i < MAX_N; i++)
//			fout << a[i] << " ";
//		fout.close();
//		int remain = n - MAX_N;
//		for (int i = 0; i < remain; i++)
//			cin >> a[i];
//		sort(a, a + remain);
//
//		ifstream fin;
//		fin.open("result.dat", ios::in);
//		float x;
//		int j = 0;
//		for (int i = 0; i < MAX_N; i++) {
//			fin >> x;
//			while (j < remain && a[j] < x) {
//				printf("%.2f ", a[j]);
//				j++;
//			}
//			printf("%.2f ", x);
//		}
//		while (j < remain) {
//			printf("%.2f ", a[j]);
//			j++;
//		}
//	}
//	system("pause");
//	return 0;
//}