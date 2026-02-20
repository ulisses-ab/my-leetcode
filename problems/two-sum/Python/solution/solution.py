from typing import List


class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        """
        Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
        
        Args:
            nums: List of integers
            target: Target sum
            
        Returns:
            List of two indices whose values sum to target
        """
        # Hash map to store value -> index mapping
        num_map = {}
        
        # Iterate through the array
        for i, num in enumerate(nums):
            # Calculate the complement needed to reach target
            complement = target - num
            
            # Check if complement exists in the map
            if complement in num_map:
                # Return the indices
                return [num_map[complement], i]
            
            # Store current number and its index in the map
            num_map[num] = i
        
        # This should never be reached given the problem constraints
        return []

