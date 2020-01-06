//#include<iostream>
//using namespace std;
//
//int makeChange(int amount, int type[], int allowedType) {
//	if (allowedType < 0) return 0;
//	else if (amount == 0) return 1;
//	else {
//		int ways = 0;
//		int d = type[allowedType];
//		for (int N = 0; d*N < amount; N++)
//			ways += makeChange(amount - N * d, type, allowedType - 1);
//		return ways;
//	}
//}
//
//int main() {
//	return 0;
//}
//
//// Lam them in ra cach doi tien