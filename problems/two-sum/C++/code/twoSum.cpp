#include <bits/stdc++.h>

std::pair<int, int> twoSum(const std::vector<int>& nums, int target) {
    std::unordered_map<int, int> numIndex; // number -> its index

    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];

        auto it = numIndex.find(complement);
        if (it != numIndex.end()) {
            // Found the pair
            return {it->second, i};
        }

        // Store this number's index
        numIndex[nums[i]] = i;
    }

    // Should never reach here if exactly one solution exists
    return {0, 0};
}
