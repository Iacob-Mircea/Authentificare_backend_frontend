import dateparser



if __name__ == "__main__":
    dt = dateparser.parse("peste o saptaman",languages=["ro"])
    print(dt)