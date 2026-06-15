def evaluate_access(role, classification, policies):

    for policy in policies:

        if (
            policy["role"].lower() ==
            role.lower()

            and

            policy["classification"].lower() ==
            classification.lower()
        ):

            if policy["action"].lower() == "deny":

                return False

    return True