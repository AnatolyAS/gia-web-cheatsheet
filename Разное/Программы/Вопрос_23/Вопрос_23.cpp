#include <iostream>
#include <gtest/gtest.h>

int Pow(int a)
{
    return a * a;
}

TEST(PowTest, NegativeNumber)
{
    EXPECT_EQ(25, Pow(-5));
}

TEST(PowTest, Zero)
{
    EXPECT_EQ(0, Pow(0));
}

TEST(PowTest, PositiveNumber)
{
    EXPECT_EQ(49, Pow(7));
}

TEST(PowTest, LeftBoundary)
{
    EXPECT_EQ(32761, Pow(-181));
}

TEST(PowTest, RightBoundary)
{
    EXPECT_EQ(32761, Pow(181));
}

TEST(PowTest, MinusOne)
{
    EXPECT_EQ(1, Pow(-1));
}

TEST(PowTest, PlusOne)
{
    EXPECT_EQ(1, Pow(1));
}

int main(int argc, char** argv)
{
    setlocale(LC_ALL, "Russian");

    std::cout << "=== Модульное тестирование функции Pow ===" << std::endl;
    ::testing::InitGoogleTest(&argc, argv);
    int result = RUN_ALL_TESTS();

    if (result == 0)
        std::cout << "=== Все тесты пройдены успешно ===" << std::endl;
    else
        std::cout << "=== Есть ошибки в тестах ===" << std::endl;

    return result;
}