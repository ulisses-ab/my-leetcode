#include <bits/stdc++.h>
#include <nlohmann/json.hpp>
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>

using json = nlohmann::json;

std::pair<int, int> twoSum(const std::vector<int>& nums, int target);

int main() {
    std::string testcase_str;
    std::cin >> testcase_str;

    json testcase = json::parse(testcase_str);

    std::vector<int> nums = testcase["input"]["nums"].get<std::vector<int>>();
    int target = testcase["input"]["target"].get<int>();

    json output = twoSum(nums, target);

    std::cout << "__BEGIN_RESULT__" << output.dump() << "__END_RESULT__";
}
