def calculate_risk(classification):

    if classification == "Public":
        return 10

    elif classification == "Internal":
        return 30

    elif classification == "Confidential":
        return 70

    elif classification == "Restricted":
        return 95

    return 0