type
    ProductAndLocations* = object
        product*: int
        locations*: seq[int]
    ProductAndLocationsArray* = seq[ProductAndLocations]

    LocationAndProducts* = object
        location*: int
        products*: seq[int]
    LocationAndProductsArray* = seq[LocationAndProducts]

    AddConfigItem* = object
        product*: int
        location*: int
        lead_time*: int
        initial_stock*: int

    AddConfigItemArray* = seq[AddConfigItem]

    SeriesProductLocation* = object
        series*: int
        product*: int
        location*: int

    SeriesProductLocationArray* = seq[SeriesProductLocation]

    Setting* = object
        setting*: string
        value*: string

    SettingsArray* = seq[Setting]
